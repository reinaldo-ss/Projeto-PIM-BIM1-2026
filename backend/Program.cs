var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<MySqlConnectionFactory>();

builder.Services.AddControllers();

builder.Services.AddScoped<CarroService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<ImagemService>();
builder.Services.AddScoped<FavoritoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("PermitirTudo");

app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseStaticFiles();

//app.UseAuthorization();

app.Run();
