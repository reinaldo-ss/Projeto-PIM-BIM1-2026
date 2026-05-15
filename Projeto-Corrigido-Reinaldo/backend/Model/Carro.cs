public class Carro
{
    public int Id { get; set; }
    public string? Chassi { get; set; }
    public string? Modelo { get; set; }
    public string? Marca { get; set; }
    public int? Ano { get; set; }
    public string? Cor { get; set; }
    public string? Descricao { get; set; }
    public string ?FotoFrente { get; set; }
    public string ?FotoTraseira { get; set; }
    public string ?FotoLateralDireita { get; set; }
    public string ?FotoLateralEsquerda { get; set; }
    public decimal Preco { get; set; }
}