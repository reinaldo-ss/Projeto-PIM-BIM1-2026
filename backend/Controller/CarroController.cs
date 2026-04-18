using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CarroController : ControllerBase
{
    private readonly CarroService _service;

    public CarroController(CarroService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var carros = _service.Listar();

        if (carros == null || carros.Count == 0)
        {
            return NotFound("Nenhum carro encontrado");
        }

        return Ok(carros);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Carro carro)
    {
        _service.Cadastrar(carro);

        if (carro == null)
        {
            return BadRequest("Dados do carro inválidos");
        }

        return Ok("Carro inserido com sucesso");
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] Carro carro)
    {
        _service.Atualizar(id, carro);

        if (carro == null)
        {
            return BadRequest("Dados do carro inválidos");
        }

        return Ok("Carro atualizado");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Deletar(id);

        if (id <= 0)
        {
            return BadRequest("ID do carro inválido");
        }
        
        return Ok("Carro deletado");
    }
}