using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FavoritoController : ControllerBase
{
    private readonly FavoritoService _service;

    public FavoritoController(FavoritoService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var favoritos = _service.Listar();

        if (favoritos == null || favoritos.Count == 0)
        {
            return NotFound("Nenhuma imagem favorita encontrada");
        }

        return Ok(favoritos);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Favorito favorito)
    {
        
        if (favorito == null)
        {
            return BadRequest("Dados do favorito inválidos");
        }

        _service.Cadastrar(favorito);

        return Ok("Imagem favorita adicionada com sucesso");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Deletar(id);

        if (id <= 0)
        {
            return BadRequest("ID da imagem favorita inválido");
        }
        
        return Ok("Imagem favorita deletada");
    }
}