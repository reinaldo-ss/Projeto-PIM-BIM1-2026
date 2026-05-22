using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ImagemController : ControllerBase
{
    private readonly ImagemService _service;

    public ImagemController(ImagemService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var imagens = _service.Listar();

        if (imagens == null || imagens.Count == 0)
        {
            return NotFound("Nenhuma imagem encontrada");
        }

        return Ok(imagens);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Imagem imagem)
    {
        _service.Cadastrar(imagem);

        if (imagem == null || !imagem.ValidarDadosImagem())
        {
            return BadRequest("Dados da imagem inválidos");
        }

        return Ok("Imagem inserida com sucesso");
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] Imagem imagem)
    {
        _service.Atualizar(id, imagem);

        if (imagem == null || !imagem.ValidarDadosImagem())
        {
            return BadRequest("Dados da imagem inválidos");
        }

        return Ok("Imagem atualizada");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Deletar(id);

        if (id <= 0)
        {
            return BadRequest("ID da imagem inválido");
        }
        
        return Ok("Imagem deletada");
    }
}