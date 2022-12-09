using Microsoft.Extensions.Logging;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Carrefour.Framework.Processes
{
    public enum StepType
    {
        Extract = 1,
        Transform = 2,
        Load = 3
    }

    public abstract class EtlProcessStep
    {
        public EtlProcessStep(Delegate function, bool async, bool many, StepType type)
        {
            Function = function;
            Async = async;
            Many = many;
            Type = type;

            ErrorBehavior = ErrorBehavior.Continue;
            MaxRetryAttempts = 3;
            RetryWaitTimes = new[]
            {
                TimeSpan.FromSeconds(5),
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(20)
            };

            BatchSize = 1;
        }

        public Delegate Function { get; }
        public bool Async { get; }
        public bool Many { get; }
        public StepType Type { get; }

        public ErrorBehavior ErrorBehavior { get; set; }
        public int MaxRetryAttempts { get; set; }
        public TimeSpan[] RetryWaitTimes { get; set; }
        public int BatchSize { get; set; }

        public abstract object? ExecuteOne(object? value = default);

        public abstract Task<object?> ExecuteOneAsync(object? value = default);

        public abstract IEnumerable<object> ExecuteMany(object? value = default);

        public abstract Task<IEnumerable<object>> ExecuteManyAsync(object? value = default);

        public async Task<(object? Value, int SuccessItems, int ErrorItems)> ExecuteAsync(object? value, CancellationToken cancellationToken, ILogger logger)
        {
            var successItems = 0;
            var errorItems = 0;

            if (BatchSize < 1)
                BatchSize = 1;

            switch (Type)
            {
                case StepType.Extract:
                    if (!Async)
                    {
                        value = !Many ? ExecuteOne(value) : ExecuteMany(value);
                    }
                    else
                    {
                        value = !Many ? await ExecuteOneAsync(value) : await ExecuteManyAsync(value);
                    }

                    if (value is IEnumerable<object> extractedValues)
                        successItems = extractedValues.Count();
                    else
                        successItems++;

                    logger.LogDebug("Item extracted successfuly.");
                    break;

                case StepType.Transform:
                case StepType.Load:
                    if (value is IEnumerable<object> values && !Many && BatchSize == 1)
                    {
                        var newValues = new List<object>();

                        (successItems, errorItems) = await values
                            .RetryForEach(async (item, i) =>
                            {
                                if (!Async)
                                {
                                    newValues.Add(ExecuteOne(item)!);
                                }
                                else
                                {
                                    newValues.Add((await ExecuteOneAsync(item))!);
                                }

                                logger.LogDebug("Item processed successfuly.");
                            })
                            .Error((ex, item, i) =>
                            {
                                logger.LogError(ex, "Error processing item {ItemIndex} of step '{StepType}'.", i, Type);

                                return ErrorBehavior == ErrorBehavior.Continue;
                            })
                            .Logger(logger)
                            .LoggerState((item, i) =>
                                new Dictionary<string, object>()
                                {
                                    ["@ItemValue"] = item,
                                    ["ItemIndex"] = i
                                })
                            .MaxRetryAttempts(MaxRetryAttempts)
                            .RetryWaitTimes(RetryWaitTimes)
                            .RunAsync(cancellationToken);

                        value = newValues.AsEnumerable();
                    }
                    else if (value is IEnumerable<object> totalValues && Many && BatchSize > 1)
                    {
                        var batches = new List<IEnumerable<object>>();
                        var newValues = new List<object>();
                        var batchCount = 1;

                        if (totalValues.Any())
                        {
                            batchCount = (int)decimal.Ceiling(totalValues.Count() / (decimal)BatchSize);

                            for (int batchIndex = 0; batchIndex < batchCount; batchIndex++)
                            {
                                batches.Add(
                                    totalValues
                                        .Skip(batchIndex * BatchSize)
                                        .Take(BatchSize)
                                        .ToList()
                                );
                            }
                        }

                        (successItems, errorItems) = await batches
                            .RetryForEach(async (item, i) =>
                            {
                                if (!Async)
                                {
                                    newValues.Add(ExecuteMany(item));
                                }
                                else
                                {
                                    newValues.Add(await ExecuteManyAsync(item));
                                }

                                logger.LogDebug("Batch processed successfuly.");
                            })
                            .Error((ex, item, i) =>
                            {
                                logger.LogError(ex, "Error processing batch {BatchIndex} of step '{StepType}'.", i, Type);

                                return ErrorBehavior == ErrorBehavior.Continue;
                            })
                            .Logger(logger)
                            .LoggerState((item, i) =>
                                new Dictionary<string, object>()
                                {
                                    ["BatchIndex"] = i,
                                    ["BatchCount"] = batchCount,
                                    ["BatchSize"] = BatchSize,
                                })
                            .MaxRetryAttempts(MaxRetryAttempts)
                            .RetryWaitTimes(RetryWaitTimes)
                            .RunAsync(cancellationToken);

                        value = newValues.AsEnumerable();
                    }
                    else
                    {
                        object logValue = null!;

                        if (Type == StepType.Load)
                        {
                            if (value is IEnumerable<object> processedValues)
                                successItems = processedValues.Count();
                            else
                                successItems++;

                            logValue = value!;
                        }

                        if (!Async)
                        {
                            value = !Many ? ExecuteOne(value) : ExecuteMany(value);
                        }
                        else
                        {
                            value = !Many ? await ExecuteOneAsync(value) : await ExecuteManyAsync(value);
                        }

                        if (Type == StepType.Transform)
                        {
                            if (value is IEnumerable<object> processedValues)
                                successItems = processedValues.Count();
                            else
                                successItems++;

                            logValue = value!;
                        }

                        logger.LogDebug("Item processed successfuly.");
                    }
                    break;
            }

            return (value, successItems, errorItems);
        }
    }

    public class EtlProcessFirtStep<TOut> : EtlProcessStep
    {
        public EtlProcessFirtStep(Func<TOut> function, StepType type)
            : base(function, false, false, type)
        {
        }

        public EtlProcessFirtStep(Func<Task<TOut>> function, StepType type)
            : base(function, true, false, type)
        {
        }

        public EtlProcessFirtStep(Func<IEnumerable<TOut>> function, StepType type)
            : base(function, false, true, type)
        {
        }

        public EtlProcessFirtStep(Func<Task<IEnumerable<TOut>>> function, StepType type)
            : base(function, true, true, type)
        {
        }

        public override object? ExecuteOne(object? value)
        {
            return ((Func<TOut>)Function).Invoke();
        }

        public override async Task<object?> ExecuteOneAsync(object? value)
        {
            return await ((Func<Task<TOut>>)Function).Invoke();
        }

        public override IEnumerable<object> ExecuteMany(object? value)
        {
            return (IEnumerable<object>)((Func<IEnumerable<TOut>>)Function).Invoke();
        }

        public override async Task<IEnumerable<object>> ExecuteManyAsync(object? value)
        {
            return (IEnumerable<object>)await ((Func<Task<IEnumerable<TOut>>>)Function).Invoke();
        }
    }

    public class EtlProcessStep<TIn, TOut> : EtlProcessStep
    {
        public EtlProcessStep(Func<TIn, TOut> function, StepType type)
            : base(function, false, false, type)
        {
        }

        public EtlProcessStep(Func<TIn, Task<TOut>> function, StepType type)
            : base(function, true, false, type)
        {
        }

        public EtlProcessStep(Func<TIn, IEnumerable<TOut>> function, StepType type)
            : base(function, false, true, type)
        {
        }

        public EtlProcessStep(Func<IEnumerable<TIn>, Task<TOut>> function, StepType type)
            : base(function, true, true, type)
        {
        }

        public EtlProcessStep(Func<IEnumerable<TIn>, TOut> function, StepType type)
            : base(function, false, true, type)
        {
        }

        public EtlProcessStep(Func<TIn, Task<IEnumerable<TOut>>> function, StepType type)
            : base(function, true, true, type)
        {
        }

        public override object? ExecuteOne(object? value)
        {
            return ((Func<TIn, TOut>)Function).Invoke((TIn)value!);
        }

        public override async Task<object?> ExecuteOneAsync(object? value)
        {
            return await ((Func<TIn, Task<TOut>>)Function).Invoke((TIn)value!);
        }

        public override IEnumerable<object> ExecuteMany(object? value)
        {
            return (IEnumerable<object>)((Func<TIn, IEnumerable<TOut>>)Function).Invoke((TIn)value!);
        }

        public override async Task<IEnumerable<object>> ExecuteManyAsync(object? value)
        {
            return (IEnumerable<object>)await ((Func<TIn, Task<IEnumerable<TOut>>>)Function).Invoke((TIn)value!);
        }
    }

    public class EtlProcessLastStep<TIn> : EtlProcessStep
    {
        public EtlProcessLastStep(Action<TIn> function, StepType type)
            : base(function, false, false, type)
        {
        }

        public EtlProcessLastStep(Func<TIn, Task> function, StepType type)
            : base(function, true, false, type)
        {
        }

        public EtlProcessLastStep(Action<IEnumerable<TIn>> function, StepType type)
            : base(function, false, true, type)
        {
        }

        public EtlProcessLastStep(Func<IEnumerable<TIn>, Task> function, StepType type)
            : base(function, true, true, type)
        {
        }

        public override object? ExecuteOne(object? value)
        {
            ((Action<TIn>)Function).Invoke((TIn)value!);
            return default;
        }

        public override async Task<object?> ExecuteOneAsync(object? value)
        {
            await ((Func<TIn, Task>)Function).Invoke((TIn)value!);
            return default;
        }

        public override IEnumerable<object> ExecuteMany(object? value)
        {
            ((Action<IEnumerable<TIn>>)Function).Invoke(((IEnumerable<object>)value!).Select(v => (TIn)v));
            return default!;
        }

        public override async Task<IEnumerable<object>> ExecuteManyAsync(object? value)
        {
            await ((Func<IEnumerable<TIn>, Task>)Function).Invoke(((IEnumerable<object>)value!).Select(v => (TIn)v));
            return default!;
        }
    }
}
