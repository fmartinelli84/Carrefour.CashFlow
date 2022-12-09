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
    public class EtlProcess
    {
        public string Name { get; protected set; }

        protected internal readonly ILogger logger = null!;
        protected internal readonly List<EtlProcessStep> steps = null!;

        public EtlProcess(string name, ILogger logger)
            : this(name, logger, new List<EtlProcessStep>())
        {
        }

        protected EtlProcess(string name, ILogger logger, List<EtlProcessStep> steps)
        {
            Name = name;
            this.logger = logger;
            this.steps = steps;
        }

        public EtlProcess<TOut> ExtractOne<TOut>(Func<TOut> extract)
        {
            steps.Add(new EtlProcessFirtStep<TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> ExtractOne<TOut>(Func<Task<TOut>> extract)
        {
            steps.Add(new EtlProcessFirtStep<TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> ExtractMany<TOut>(Func<IEnumerable<TOut>> extract)
        {
            steps.Add(new EtlProcessFirtStep<TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> ExtractMany<TOut>(Func<Task<IEnumerable<TOut>>> extract)
        {
            steps.Add(new EtlProcessFirtStep<TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
    }

    public class EtlProcess<TIn> : EtlProcess
    {
        protected internal EtlProcess(EtlProcess etlProcess)
            : base(etlProcess.Name, etlProcess.logger, etlProcess.steps)
        {
        }

        public EtlProcess<TOut> ExtractOne<TOut>(Func<TIn, TOut> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> ExtractOne<TOut>(Func<TIn, Task<TOut>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> ExtractMany<TOut>(Func<TIn, IEnumerable<TOut>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> ExtractMany<TOut>(Func<TIn, Task<IEnumerable<TOut>>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Extract));

            return new EtlProcess<TOut>(this);
        }

        public EtlProcess<TOut> TransformOne<TOut>(Func<TIn, TOut> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Transform));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> TransformOne<TOut>(Func<TIn, Task<TOut>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Transform));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> TransformMany<TOut>(Func<TIn, IEnumerable<TOut>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Transform));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> TransformMany<TOut>(Func<TIn, Task<IEnumerable<TOut>>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Transform));

            return new EtlProcess<TOut>(this);
        }

        public EtlProcess<TOut> LoadOne<TOut>(Func<TIn, TOut> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Load));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> LoadOne<TOut>(Func<TIn, Task<TOut>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Load));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> LoadMany<TOut>(Func<IEnumerable<TIn>, TOut> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Load));

            return new EtlProcess<TOut>(this);
        }
        public EtlProcess<TOut> LoadMany<TOut>(Func<IEnumerable<TIn>, Task<TOut>> extract)
        {
            steps.Add(new EtlProcessStep<TIn, TOut>(extract, StepType.Load));

            return new EtlProcess<TOut>(this);
        }

        public EtlProcess<TIn> LoadOne(Action<TIn> extract)
        {
            steps.Add(new EtlProcessLastStep<TIn>(extract, StepType.Load));

            return new EtlProcess<TIn>(this);
        }
        public EtlProcess<TIn> LoadOne(Func<TIn, Task> extract)
        {
            steps.Add(new EtlProcessLastStep<TIn>(extract, StepType.Load));

            return new EtlProcess<TIn>(this);
        }
        public EtlProcess<TIn> LoadMany(Action<IEnumerable<TIn>> extract)
        {
            steps.Add(new EtlProcessLastStep<TIn>(extract, StepType.Load));

            return new EtlProcess<TIn>(this);
        }
        public EtlProcess<TIn> LoadMany(Func<IEnumerable<TIn>, Task> extract)
        {
            steps.Add(new EtlProcessLastStep<TIn>(extract, StepType.Load));

            return new EtlProcess<TIn>(this);
        }

        public EtlProcess<TIn> ContinueOnError()
        {
            steps.Last().ErrorBehavior = ErrorBehavior.Continue;
            return this;
        }
        public EtlProcess<TIn> ThrowOnError()
        {
            steps.Last().ErrorBehavior = ErrorBehavior.Throw;
            return this;
        }
        public EtlProcess<TIn> NoRetry()
        {
            return Retry(0);
        }
        public EtlProcess<TIn> Retry(int maxRetryAttempts, params TimeSpan[] retryWaitTimes)
        {
            steps.Last().MaxRetryAttempts = maxRetryAttempts;

            if (retryWaitTimes.Length > 0)
                steps.Last().RetryWaitTimes = retryWaitTimes;

            return this;
        }

        public EtlProcess<TIn> Batch(int size)
        {
            steps.Last().BatchSize = size;
            return this;
        }

        public async Task<bool> RunAsync(CancellationToken cancellationToken = default)
        {
            var successSteps = 0;
            var errorSteps = 0;

            using (logger.BeginScope(new Dictionary<string, object>()
            {
                ["ProcessName"] = Name
            }))
            {
                logger.LogInformation("Starting '{ProcessName}' process...", Name);

                if (cancellationToken != default)
                {
                    cancellationToken.Register(() => logger.LogInformation("Process '{ProcessName}' stopped.", Name));
                }

                (successSteps, errorSteps) = await ExecuteStepsAsync(cancellationToken);

                if (errorSteps > 0)
                {
                    logger.LogWarning("Process '{ProcessName}' completed with errors. Steps: {TotalSteps}, Successes: {SuccessSteps}, Errors: {ErrorSteps}.", Name, successSteps + errorSteps, successSteps, errorSteps);
                }
                else
                {
                    logger.LogInformation("Process '{ProcessName}' completed successfuly. Steps: {TotalSteps}, Successes: {SuccessSteps}, Errors: {ErrorSteps}.", Name, successSteps + errorSteps, successSteps, errorSteps);
                }
            }

            return errorSteps == 0;
        }

        private async Task<(int successSteps, int errorSteps)> ExecuteStepsAsync(CancellationToken cancellationToken = default)
        {
            var successItems = 0;
            var errorItems = 0;

            object? lastValue = null;

            (int successSteps, int errorSteps) = await steps
                .RetryForEach(async (step, i) =>
                {
                    successItems = 0;
                    errorItems = 0;

                    logger.LogDebug("Starting '{StepType}' step...", step.Type);

                    (lastValue, successItems, errorItems) = await step.ExecuteAsync(lastValue, cancellationToken, logger);
                })
                .Error((ex, step, i) =>
                {
                    errorItems++;

                    logger.LogError(ex, "Error on '{StepType}' step of '{ProcessName}' process.", step.Type, Name);

                    return step.ErrorBehavior == ErrorBehavior.Continue;
                })
                .Continue((step, i) =>
                {
                    if (errorItems > 0)
                    {
                        logger.LogWarning("Step '{StepType}' completed with errors. Items: {TotalItems}, Successes: {SuccessItems}, Errors: {ErrorItems}.", step.Type, successItems + errorItems, successItems, errorItems);
                    }
                    else
                    {
                        logger.LogDebug("Step '{StepType}' completed successfuly. Items: {TotalItems}, Successes: {SuccessItems}, Errors: {ErrorItems}.", step.Type, successItems + errorItems, successItems, errorItems);
                    }
                })
                .Logger(logger)
                .LoggerState((step, i) =>
                    new Dictionary<string, object>()
                    {
                        ["StepType"] = step.Type,
                        ["StepIndex"] = i,
                    })
                .MaxRetryAttempts((step, i) => step.MaxRetryAttempts)
                .RetryWaitTimes((step, i) => step.RetryWaitTimes)
                .RunAsync(cancellationToken);

            return (successSteps, errorSteps);
        }
    }
}
