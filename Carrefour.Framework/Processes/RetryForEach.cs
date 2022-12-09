using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Carrefour.Framework.Processes
{
    public class RetryForEach<TItem>
    {
        private readonly IEnumerable<TItem> list;
        private readonly Func<TItem, int, Task<bool>> itemHandler;

        private Func<Exception, TItem, int, Task<bool>> errorHandler = null!;
        private Func<TItem, int, Task<bool>> continueHandler = null!;

        private ILogger logger = null!;

        private Dictionary<string, object> loggerState = null!;
        private Func<TItem, int, Dictionary<string, object>> loggerStateFactory = null!;

        private int maxRetryAttempts = 3;
        private Func<TItem, int, int> maxRetryAttemptsFactory = null!;

        private TimeSpan[] retryWaitTimes = new[]
        {
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(20)
        };
        private Func<TItem, int, TimeSpan[]> retryWaitTimesFactory = null!;

        public RetryForEach(IEnumerable<TItem> list, Action<TItem, int> itemHandler)
            : this(list,
                   async (item, index) =>
                   {
                       itemHandler(item, index);
                       return await Task.FromResult(true);
                   })
        {
        }
        public RetryForEach(IEnumerable<TItem> list, Func<TItem, int, bool> itemHandler)
            : this(list,
                async (item, index) =>
                {
                    return await Task.FromResult(itemHandler(item, index));
                })
        {
        }
        public RetryForEach(IEnumerable<TItem> list, Func<TItem, int, Task> itemHandler)
            : this(list,
                async (item, index) =>
                {
                    await itemHandler(item, index);
                    return await Task.FromResult(true);
                })
        {
        }
        public RetryForEach(IEnumerable<TItem> list, Func<TItem, int, Task<bool>> itemHandler)
        {
            this.list = list;
            this.itemHandler = itemHandler;
        }

        public RetryForEach<TItem> Error(Action<Exception, TItem, int> errorHandler)
        {
            this.errorHandler = async (ex, item, index) =>
            {
                errorHandler(ex, item, index);
                return await Task.FromResult(true);
            };
            return this;
        }
        public RetryForEach<TItem> Error(Func<Exception, TItem, int, bool> errorHandler)
        {
            this.errorHandler = async (ex, item, index) =>
            {
                return await Task.FromResult(errorHandler(ex, item, index));
            };
            return this;
        }
        public RetryForEach<TItem> Error(Func<Exception, TItem, int, Task> errorHandler)
        {
            this.errorHandler = async (ex, item, index) =>
            {
                await errorHandler(ex, item, index);
                return await Task.FromResult(true);
            };
            return this;
        }
        public RetryForEach<TItem> Error(Func<Exception, TItem, int, Task<bool>> errorHandler)
        {
            this.errorHandler = errorHandler;
            return this;
        }

        public RetryForEach<TItem> Continue(Action<TItem, int> continueHandler)
        {
            this.continueHandler = async (item, index) =>
            {
                continueHandler(item, index);
                return await Task.FromResult(true);
            };
            return this;
        }
        public RetryForEach<TItem> Continue(Func<TItem, int, bool> continueHandler)
        {
            this.continueHandler = async (item, index) =>
            {
                return await Task.FromResult(continueHandler(item, index));
            };
            return this;
        }
        public RetryForEach<TItem> Continue(Func<TItem, int, Task> continueHandler)
        {
            this.continueHandler = async (item, index) =>
            {
                await continueHandler(item, index);
                return await Task.FromResult(true);
            };
            return this;
        }
        public RetryForEach<TItem> Continue(Func<TItem, int, Task<bool>> continueHandler)
        {
            this.continueHandler = continueHandler;
            return this;
        }

        public RetryForEach<TItem> Logger(ILogger logger)
        {
            this.logger = logger;
            return this;
        }

        public RetryForEach<TItem> LoggerState(Dictionary<string, object> loggerState)
        {
            this.loggerState = loggerState;
            return this;
        }
        public RetryForEach<TItem> LoggerState(Func<TItem, int, Dictionary<string, object>> loggerStateFactory)
        {
            this.loggerStateFactory = loggerStateFactory;
            return this;
        }

        public RetryForEach<TItem> MaxRetryAttempts(int maxRetryAttempts)
        {
            this.maxRetryAttempts = maxRetryAttempts;
            return this;
        }
        public RetryForEach<TItem> MaxRetryAttempts(Func<TItem, int, int> maxRetryAttemptsFactory)
        {
            this.maxRetryAttemptsFactory = maxRetryAttemptsFactory;
            return this;
        }

        public RetryForEach<TItem> RetryWaitTimes(params TimeSpan[] retryWaitTimes)
        {
            this.retryWaitTimes = retryWaitTimes;
            return this;
        }
        public RetryForEach<TItem> RetryWaitTimes(Func<TItem, int, TimeSpan[]> retryWaitTimesFactory)
        {
            this.retryWaitTimesFactory = retryWaitTimesFactory;
            return this;
        }

        public void Run(CancellationToken cancellationToken = default)
        {
            RunAsync(cancellationToken).Wait();
        }

        public async Task<(int Sucesses, int Errors)> RunAsync(CancellationToken cancellationToken = default)
        {
            var sucesses = 0;
            var errors = 0;
            var retry = 0;

            for (int i = 0; i < list.Count(); i++)
            {
                var item = list.ElementAt(i);

                IDisposable loggerScope = null!;

                try
                {
                    if (logger != null)
                    {
                        if (loggerStateFactory != null)
                            loggerScope = logger.BeginScope(loggerStateFactory(item, i))!;
                        else if (loggerState != null)
                            loggerScope = logger.BeginScope(loggerState)!;
                    }

                    var maxRetryAttempts = maxRetryAttemptsFactory != null ? maxRetryAttemptsFactory(item, i) : this.maxRetryAttempts;
                    maxRetryAttempts = maxRetryAttempts <= 100 ? maxRetryAttempts : 100;

                    var retryWaitTimes = retryWaitTimesFactory != null ? retryWaitTimesFactory(item, i) : this.retryWaitTimes;
                    retryWaitTimes = retryWaitTimes ?? new TimeSpan[] { };

                    if (cancellationToken != default)
                        cancellationToken.ThrowIfCancellationRequested();

                    try
                    {
                        if (!await itemHandler(item, i))
                        {
                            sucesses++;
                            break;
                        }

                        sucesses++;
                        retry = 0;
                    }
                    catch (OperationCanceledException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        if (retry >= maxRetryAttempts)
                        {
                            if (maxRetryAttempts > 0)
                                logger?.LogWarning("{RetryAttempt}° attempt fail, maximum number of attempts reached.", retry);

                            errors++;
                            retry = 0;

                            if (errorHandler == null || !await errorHandler(ex, item, i))
                                throw;
                        }
                        else
                        {
                            var waitTime = retry < retryWaitTimes.Length ? retryWaitTimes[retry] : retryWaitTimes.LastOrDefault();

                            i--;
                            retry++;

                            logger?.LogWarning(ex, "{RetryAttempt}° attempt fail, waiting {RetryWaitTime}...", retry, waitTime);

                            if (waitTime > TimeSpan.Zero)
                            {
                                if (cancellationToken != default)
                                    await Task.Delay(waitTime, cancellationToken);
                                else
                                    await Task.Delay(waitTime);
                            }

                            continue;
                        }
                    }

                    if (continueHandler != null && !await continueHandler(item, i))
                        break;
                }
                finally
                {
                    loggerScope?.Dispose();
                }
            }

            return (sucesses, errors);
        }
    }
}
