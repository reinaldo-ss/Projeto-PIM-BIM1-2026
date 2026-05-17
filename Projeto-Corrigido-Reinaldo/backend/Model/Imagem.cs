public class Imagem
{
    public int Id { get; init; }
    public string? Chassi { get; init; }
    public string? Caminho_imagem { get; init; }
    public string? Tipo_imagem { get; init; }

    public Imagem() { }

    public Imagem(string Chassi, string Caminho_imagem, string Tipo_imagem)
    {
        this.Chassi = Chassi;
        this.Caminho_imagem = Caminho_imagem;
        this.Tipo_imagem = Tipo_imagem;
    }

    public bool ValidarDadosImagem()
    {
        if (string.IsNullOrEmpty(Chassi) ||
            string.IsNullOrEmpty(Caminho_imagem) ||
            string.IsNullOrEmpty(Tipo_imagem))
        {
            return false;
        }
        return true;
    }
};