using Carrefour.Framework.Reflection;
using Hangfire;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Carrefour.Framework.Jobs
{
    public class JobConfigurator
    {
        public JobConfigurator AddJob<TJob>(Expression<Func<TJob, Task>> methodCall, string cronExpression)
            where TJob : class
        {
            var methodName = methodCall.ExtractNames().First();

            var jobName = typeof(TJob).GetJobName(methodName);

            RecurringJob.AddOrUpdate<JobExecutor<TJob>>(
                jobName,
                j => j.ExecuteAsync(jobName, methodName, JobCancellationToken.Null),
                cronExpression,
                TimeZoneInfo.Local);

            return this;
        }
    }
}
