using CBHPredictorWebAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CBHPredictorWebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CORSPolicy",
                    builder =>
                    {
                        builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins("http://localhost:3000", "https://appname.azurestaticapps.net");
                    });
            }
                );

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Dependency Injection
            builder.Services.AddDbContext<CBHDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DevConnection")));

            builder.Services.AddCors();

            var app = builder.Build();

            app.UseCors(options => options.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("CORSPolicy");

            app.MapControllers();

            app.Run();
        }
    }
}