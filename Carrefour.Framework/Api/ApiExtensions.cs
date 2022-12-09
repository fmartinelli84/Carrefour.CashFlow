using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;
using System.Security.Claims;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Identity;
using System.Threading.Channels;
using System.Linq;
using System.Reflection;
using System.IO;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Carrefour.Framework.Exceptions;
using Carrefour.Framework.Web;
using Carrefour.Framework.Data;
using Carrefour.Framework.Serialization;
using Microsoft.OpenApi.Models;

namespace Carrefour.Framework.Api
{
    public static class ApiExtensions
    {
        public static IServiceCollection AddApi<TDbContext>(this IServiceCollection services, IConfiguration configuration)
            where TDbContext : DbContext
        {
            services.Configure<WebOptions>(configuration.GetSection("Web"));

            if (configuration.GetSection("Web") is not null)
            {
                services.AddCors(options =>
                {
                    var webAddress = configuration.GetSection("Web").Get<WebOptions>()!.Address.GetLeftPart(UriPartial.Authority);

                    options.AddDefaultPolicy(builder =>
                        builder.WithOrigins(webAddress)
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                });
            }

            services.AddDbContext<DbContext, TDbContext>(configuration);

            var mvcBuilder = services.AddControllers(options =>
            {
                options.Filters.Add<NotFoundResultFilter>();
            })
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });

            services.AddHttpContextAccessor();

            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = Assembly.GetEntryAssembly()!.GetName().Name, Version = "V1" });

                // Set the comments path for the Swagger JSON and UI.
                foreach (var xmlFile in Directory.GetFiles(AppContext.BaseDirectory, "*.XML", SearchOption.AllDirectories))
                {
                    // pick comments from classes, include controller comments: another tip from StackOverflow
                    options.IncludeXmlComments(xmlFile, includeControllerXmlComments: true);
                }
            });

            return services;
        }

        public static IApplicationBuilder UseApi(this IApplicationBuilder app, IHostEnvironment env)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        var errors = ErrorDetail.FromException(contextFeature.Error);

                        await context.Response.WriteAsync(errors.ToJson());
                    }
                });
            });


            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
            app.UseHttpsRedirection();


            app.UseStaticFiles();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", $"{Assembly.GetEntryAssembly()!.GetName().Name} V1");
            });

            app.UseRouting();

            app.UseCors();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            return app;
        }
    }
}
