using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly UsuarioService _service;

    public UsuarioController(UsuarioService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var usuarios = _service.Listar();

        if (usuarios == null || usuarios.Count == 0)
        {
            return NotFound("Nenhum usuário encontrado");
        }

        return Ok(usuarios);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Usuario usuario)
    {
        if (usuario == null)
        {
            return BadRequest("Dados do usuário inválidos");
        }

        _service.Cadastrar(usuario);

        return Ok("Usuário inserido com sucesso");
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] Usuario usuario)
    {
        if (usuario == null)
        {
            return BadRequest("Dados do usuário inválidos");
        }
        
        _service.Atualizar(id, usuario);

        return Ok("Usuário atualizado");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Deletar(id);

        if (id <= 0)
        {
            return BadRequest("ID do usuário inválido");
        }
        
        return Ok("Usuário deletado");
    }
}