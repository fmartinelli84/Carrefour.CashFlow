using Carrefour.Framework.Data;
using Carrefour.Framework.Web;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Runtime.CompilerServices;

namespace Carrefour.Framework.Jobs
{
    public static class JobExtensions
    {
        public static IServiceCollection AddJob<TDbContext>(this IServiceCollection services, IConfiguration configuration)
            where TDbContext : DbContext
        {
            services.Configure<WebOptions>(configuration.GetSection("Web"));

            services.AddDbContext<DbContext, TDbContext>(configuration);

            services.AddHttpContextAccessor();

            // Add Hangfire services.
            services.AddHangfire(globalConfiguration => globalConfiguration
                .UseSqlServerStorage(configuration.GetConnectionString("DefaultConnection")));

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            return services;
        }

        public static IApplicationBuilder UseJob(this IApplicationBuilder app, IHostEnvironment env, Action<JobConfigurator>? configure = null)
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
            app.UseHttpsRedirection();


            var options = new DashboardOptions()
            {
                Authorization = new[] { new DashboardAuthorizationFilter() }
            };

            app.UseHangfireDashboard("/jobs", options);


            var configurator = new JobConfigurator();

            if (configure is not null)
                configure(configurator);

            return app;
        }

        public static string GetJobName(this Type type, [CallerMemberName] string? methodName = null)
        {
            var typeName = type.Name;

            if (typeName.EndsWith("Business"))
            {
                typeName = $"{typeName.Remove(typeName.LastIndexOf("Business"))}";
            }
            if (typeName.EndsWith("Manager"))
            {
                typeName = $"{typeName.Remove(typeName.LastIndexOf("Manager"))}";
            }

            if ((methodName?.EndsWith("Async")).GetValueOrDefault())
            {
                methodName = $"{methodName!.Remove(methodName.LastIndexOf("Async"))}";
            }

            return $"{typeName}.{methodName}";
        }
    }
}
