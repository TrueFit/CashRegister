using CashRegister.Core.Configuration;
using CashRegister.Core.Models;
using CashRegister.Core.Rules;
using CashRegister.Core.Services;
using CashRegister.Core.Strategies;
using CashRegister.Core.Validators;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Configuration — singleton, seeded from appsettings.json, mutable at runtime.
// ---------------------------------------------------------------------------
var settings = builder.Configuration
    .GetSection(CashRegisterSettings.SectionName)
    .Get<CashRegisterSettings>() ?? new CashRegisterSettings();

builder.Services.AddSingleton(settings);

// ---------------------------------------------------------------------------
// Core services
// ---------------------------------------------------------------------------

// Currency registry — singleton, pre-populated with USD and EUR.
builder.Services.AddSingleton<ICurrencyRegistry, CurrencyRegistry>();

// Strategies — singletons (stateless).
builder.Services.AddSingleton<MinimumChangeStrategy>();
builder.Services.AddSingleton<RandomChangeStrategy>();

// Rules — DivisibleByRule reads the divisor from the settings singleton on each call.
builder.Services.AddSingleton<IChangeRule, DivisibleByRule>();

// Change service — scoped (one per request).
builder.Services.AddScoped<IChangeService, ChangeService>();

// File parser — transient (no state).
builder.Services.AddTransient<IFileParserService, FileParserService>();

// FluentValidation validators.
builder.Services.AddScoped<IValidator<TransactionInput>, TransactionInputValidator>();

// ---------------------------------------------------------------------------
// ASP.NET Core services
// ---------------------------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Cash Register API",
        Version = "v1",
        Description = "REST API for the Cash Register application. " +
                      "Calculates change denominations from flat file uploads or single transactions. " +
                      "Supports configurable random change generation and multiple currencies."
    });
});

// ---------------------------------------------------------------------------
// CORS — allow Vite dev server and any origin in Docker.
// ---------------------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // In Docker / production: allow any origin for containerized deployments.
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serve React production build from wwwroot (if present).
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors();

app.MapControllers();

// Fallback: serve index.html for client-side routing (SPA support).
app.MapFallbackToFile("index.html");

app.Run();
