using cash_register_backend;
using cash_register_backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register CORS policy - allow the Vite dev server origin(s)
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173") // include both schemes if needed
            .AllowAnyHeader()
            .AllowAnyMethod();
            // .AllowCredentials(); // only if you need cookies/auth; then configure accordingly
    });
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
builder.Services.AddScoped<ICalculateService, CalculateService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IRuleSerivce, RuleService>();

var app = builder.Build();

// Use the CORS policy early
app.UseCors("LocalDev");

// Optional: only use HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Authentication / Authorization middleware should run after UseCors
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
