public class Carro
{
    public int Id { get; init; }
    public string? Chassi { get; init; }
    public string? Modelo { get; init; }
    public string? Marca { get; init; }
    public int? Ano { get; init; }
    public string? Cor { get; init; }
    public string? Descricao { get; init; }
    public string ?FotoFrente { get; init; }
    public string ?FotoTraseira { get; init; }
    public string ?FotoLateralDireita { get; init; }
    public string ?FotoLateralEsquerda { get; init; }
    public decimal Preco { get; init; }

    public Carro() { }

    public Carro(string chassi, string modelo, string marca,
                                  int ano, string cor, string descricao, string fotoFrente,
                                  string fotoTraseira, string fotoLateralDireita,
                                  string fotoLateralEsquerda, decimal preco)
    {
        Chassi = chassi;
        Modelo = modelo;
        Marca = marca;
        Ano = ano;
        Cor = cor;
        Descricao = descricao;
        FotoFrente = fotoFrente;
        FotoTraseira = fotoTraseira;
        FotoLateralDireita = fotoLateralDireita;
        FotoLateralEsquerda = fotoLateralEsquerda;
        Preco = preco;
    }

    public bool ValidarDadosCarro()
    {
        if (string.IsNullOrWhiteSpace(Chassi) ||
            string.IsNullOrWhiteSpace(Modelo) ||
            string.IsNullOrWhiteSpace(Marca) ||
            Ano <= 0 ||
            string.IsNullOrWhiteSpace(Cor) ||
            string.IsNullOrWhiteSpace(Descricao) ||
            string.IsNullOrWhiteSpace(FotoFrente) ||
            string.IsNullOrWhiteSpace(FotoTraseira) ||
            string.IsNullOrWhiteSpace(FotoLateralDireita) ||
            string.IsNullOrWhiteSpace(FotoLateralEsquerda) ||
            Preco <= 0)

        {
            return false;
        }
        return true;
    }
};