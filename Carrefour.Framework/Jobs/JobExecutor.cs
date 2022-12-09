using Hangfire;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Carrefour.Framework.Jobs
{
    public class JobExecutor<TJob>
        where TJob : class
    {
        private readonly TJob job;

        public JobExecutor(TJob business)
        {
            job = business;
        }

        [DisplayName("{0}")]
        [DisableConcurrentExecution(5)]
        [AutomaticRetry(Attempts = 0, LogEvents = false, OnAttemptsExceeded = AttemptsExceededAction.Delete)]
        public async Task ExecuteAsync(string jobName, string methodName, IJobCancellationToken cancellationToken)
        {
            await ((Task)job.GetType()
                .GetMethod(methodName)!
                .Invoke(job, new object[] { cancellationToken.ShutdownToken })!)
                .ConfigureAwait(false);
        }
    }
}
