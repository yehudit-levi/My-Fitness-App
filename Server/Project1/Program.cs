using DataContext;
using Repository.Interfaces;
using Service;
using Microsoft.Extensions.DependencyInjection;
using Repository.Repositories;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using Common;
using Repository.Entity;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// --- 1. הגדרות שירותים (Services) ---

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policyBuilder => policyBuilder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Disposition", "Access-Control-Allow-Origin"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.OperationFilter<SwaggerFileOperationFilter>();
});

builder.Services.AddServices(@"server=(localdb)\MSSQLLocaldb;database=SportDb;trusted_connection=true;");

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddScoped<IService<CoachRequestDto>, CoachRequestsService>();
builder.Services.AddScoped<IRepository<CoachRequests>, CoachRequestsRepository>();

var app = builder.Build();

// --- 2. הגדרת Pipeline (סדר הפעולות של השרת) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1"));
}

app.UseHttpsRedirection();

// תיקיית התמונות מוגדרת יחסית לתיקיית ההרצה של השרת (ולא לנתיב קבוע במחשב מסוים),
// כדי שהפרויקט ירוץ באותה צורה על כל מחשב.
string imagesPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images");

// בדיקה אם התיקייה קיימת, אם לא - יצירה שלה (מונע שגיאות קריסה בהרצה ראשונה)
if (!Directory.Exists(imagesPath))
{
    Directory.CreateDirectory(imagesPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesPath),
    RequestPath = "/Images" // זה יהיה הנתיב ב-URL (למשל localhost:7225/Images/pic.jpg)
});

// מאפשר גם שימוש בתיקיית wwwroot הרגילה אם קיימת
app.UseStaticFiles();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

// --- 3. Swagger Filter (נשאר ללא שינוי) ---
public class SwaggerFileOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParameters = context.MethodInfo.GetParameters()
            .Where(p => p.ParameterType == typeof(IFormFile))
            .ToList();

        if (fileParameters.Count == 0) return;

        operation.RequestBody = new OpenApiRequestBody
        {
            Content = {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = fileParameters.ToDictionary(
                            p => p.Name,
                            p => new OpenApiSchema { Type = "string", Format = "binary" }),
                        Required = fileParameters.Select(p => p.Name).ToHashSet()
                    }
                }
            }
        };
    }
}