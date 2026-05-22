using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CarroController : ControllerBase
{
    private readonly ICarroService _service;
    private readonly IImagemService _imagemService;

    public CarroController(ICarroService service, IImagemService ImagemService)
    {
        _service = service;
        _imagemService = ImagemService;
    }

    // Endpoint para listar os carros

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

    [HttpGet("buscar/{termo}")]
    public IActionResult Get(string termo)
    {
        if (string.IsNullOrWhiteSpace(termo))
        {
            return BadRequest("O termo de pesquisa não pode ser vazio");
        }

        var carros = _service.BuscarPorNome(termo);

        if (carros == null || carros.Count == 0)
        {
            return NotFound("Nenhum carro encontrado com o seguinte termo: " + termo);
        }

        return Ok(carros);
    }

    // Endpoint para cadastrar os dados de um carro

    [HttpPost]
    public IActionResult Post([FromBody] Carro carro)
    {
        if (carro == null || !carro.ValidarDadosCarro())
        {
            return BadRequest("Dados do carro inválidos");
        }

        _service.Cadastrar(carro);

        return Ok("Carro inserido com sucesso");
    }

    // Endpoint para cadastrar as fotos de um carro

    [HttpPost]
    public async Task<IActionResult> Post(
        [FromForm] Carro carro,
        IFormFile FotoFrente,
        IFormFile FotoTraseira,
        IFormFile FotoLateralDireita,
        IFormFile FotoLateralEsquerda)
    {
        //Console.WriteLine($"Dados que chegaram: {carro.Chassi}, {carro.Modelo}, {carro.Marca}, {carro.Ano}, {carro.Cor}, {carro.Descricao}, {carro.Preco}");

        if (carro == null || !carro.ValidarDadosCarro())
        {
            return BadRequest("Dados de carro inválidos");
        }
        
        _service.Cadastrar(carro);

        var pastaFotos = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "carros");
        if (!Directory.Exists(pastaFotos)) Directory.CreateDirectory(pastaFotos);

        // 3. Função para não repetir código: Salva a foto na pasta e no banco
        async Task SalvarEGravarFoto(IFormFile foto)
        {
            if (foto != null && foto.Length > 0)
            {
                // Cria um nome único pra foto não substituir a de outros carros
                var nomeArquivo = Guid.NewGuid().ToString() + Path.GetExtension(foto.FileName);
                var caminhoCompleto = Path.Combine(pastaFotos, nomeArquivo);

                // Salva na pasta
                using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                {
                    await foto.CopyToAsync(stream);
                }

                // O caminho relativo que vai ficar no banco
                var caminhoBanco = "/img/carros/" + nomeArquivo;

                // Chama o serviço para salvar apenas essa imagem atrelada ao chassi
                var novaImagem = new Imagem
                {
                    Chassi = carro.Chassi,
                    Caminho_imagem = caminhoBanco,
                    Tipo_imagem = foto.Name
                };

                _imagemService.Cadastrar(novaImagem);
            }
        }

        // 4. Executa a função para as fotos que vieram do form
        await SalvarEGravarFoto(FotoFrente);
        await SalvarEGravarFoto(FotoTraseira);
        await SalvarEGravarFoto(FotoLateralDireita);
        await SalvarEGravarFoto(FotoLateralEsquerda);

        return Ok("Carro e fotos cadastrados");
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromForm] Carro carro)
    {
        if (id <= 0 || carro == null || !carro.ValidarDadosCarro())
        {
            return BadRequest("ID ou dados do carro inválidos");
        }

        try
        {
            _service.Atualizar(id, carro);

            return Ok("Veículo atualizado com sucesso");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
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