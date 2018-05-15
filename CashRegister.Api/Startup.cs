using System.Reflection;
using CashRegister.Api.Core.Filters;
using CashRegister.Api.Services;
using CashRegister.Domain.SalesAggregate;
using MediatR;
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
            services.AddMediatR(typeof(CalculateChangeHandler).GetTypeInfo().Assembly);

            services.AddSwaggerGen(c =>
            {
                c.OperationFilter<FormFileOperationFilter>();

                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "Cash Register",
                    Description = "Creative Cash Draw Solutions - Cash Register",
                    TermsOfService = "None",
                    Contact = new Contact
                    {
                        Name = Configuration["Personal:Name"],
                        Email = Configuration["Personal:Email"]
                    }
                });
            });

            services.AddTransient<IRegisterService, RegisterService>();
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
