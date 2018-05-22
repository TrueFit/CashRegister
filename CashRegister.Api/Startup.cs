using System;
using System.Collections.Generic;
using CashRegister.Api.Core;
using CashRegister.Api.Core.Filters;
using CashRegister.Api.Services;
using CashRegister.Domain.SalesAggregate;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace CashRegister
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.AddSwaggerGen(c =>
            {
                c.OperationFilter<FormFileOperationFilter>();

                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "Cash Register",
                    Description = "Creative Cash Draw Solutions - Cash Register"
                });
            });

            services.AddTransient<IRegisterService, RegisterService>();
            services.AddTransient<ICashRegister>(c =>
            {
                // Provide configurable divisor - if not supplied or invalid, then
                // default to 3 per business requirements
                var configurableDivisor = Configuration["CreativeCashDrawSolutions:RandomDivisor"];
                var divisorConfigured = int.TryParse(configurableDivisor, out int randomDivisor);

                // Provide ability to configure denominations for different cultures
                List<Denomination> denominations;
                try
                {
                    denominations = Configuration.GetSection("CreativeCashDrawSolutions:Denominations").Get<List<Denomination>>();
                }
                catch(Exception)
                {
                    // Failed to parse configurable denominations, falling back to USD
                    denominations = DefaultConfiguration.Denominations;
                }

                return new Domain.SalesAggregate.CashRegister(
                    divisorConfigured ? randomDivisor : DefaultConfiguration.Divisor,
                    denominations
                );
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cash Register API V1");
            });
        }
    }
}
