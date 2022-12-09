using Carrefour.CashFlow.Business;
using Carrefour.CashFlow.Data;
using Carrefour.Framework.Jobs;
using Carrefour.Framework.Logging;
using Hangfire;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.ConfigureLogging();

builder.Services.AddJob<CashFlowDbContext>(builder.Configuration);

builder.Services.AddBusiness(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseJob(app.Environment,
    configure =>
    {
        configure.AddJob<ConsolidatedBusiness>(
             j => j.GenerateAsync(CancellationToken.None),
             "*/1 * * * *");
    });

app.Run();
