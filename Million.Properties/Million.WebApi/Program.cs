
using Million.Application.Properties.Ports;
using Million.Application.Properties.Services;
using Million.Infrastructure.Mongo;
using Million.Infrastructure.Mongo.Repositories;

namespace Million.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(p => p.AddDefaultPolicy(b =>
    b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));

            var mongoOpts = new MongoOptions();
            builder.Configuration.GetSection("Mongo").Bind(mongoOpts);
            builder.Services.AddSingleton(mongoOpts);
            builder.Services.AddSingleton<MongoContext>();
            builder.Services.AddScoped<IPropertyService, PropertyService>();
            builder.Services.AddScoped<IPropertyReadRepository, PropertyReadRepository>();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors();
            app.MapControllers();

            app.Run();
        }
    }
}
