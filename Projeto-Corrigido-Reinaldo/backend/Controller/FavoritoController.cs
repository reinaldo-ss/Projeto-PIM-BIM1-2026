using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FavoritoController : ControllerBase
{
    private readonly IFavoritoService _service;

    public FavoritoController(IFavoritoService service)
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

    [HttpGet("usuario/{usuarioId}")]
    public IActionResult GetByUsuario(int usuarioId)
    {
        if (usuarioId <= 0)
        {
            return BadRequest("ID de usuário inválido");
        }

        var carrosFavoritos = _service.ListarPorUsuario(usuarioId);
        
        return Ok(carrosFavoritos);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Favorito favorito)
    {
        //Console.WriteLine($"Recebido: Usuario {favorito.Usuario_id}, Carro {favorito.Carro_id}");
        if (favorito == null || !favorito.ValidarDadosFavorito())
        {
            return BadRequest("Dados do favorito inválidos");
        }

        _service.Cadastrar(favorito);

        return Ok("Imagem favorita adicionada com sucesso");
    }

    [HttpDelete("{usuarioId}/{carroId}")]
    public IActionResult Delete(int usuarioId, int carroId)
    {

        if (usuarioId <= 0 || carroId <= 0)
        {
            return BadRequest("IDs inválidos para remoção de carro favorito");
        }

        _service.Deletar(usuarioId, carroId);

        return Ok("Imagem favorita deletada");
    }
}