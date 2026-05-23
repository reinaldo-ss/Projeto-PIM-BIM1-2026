public class Favorito
{
    public int Id_favorito { get; init; }
    public int Usuario_id { get; init; }
    public int Carro_id { get; init; }

    public Favorito() { }

    public Favorito(int Usuario_id, int Carro_id)
    {
        this.Usuario_id = Usuario_id;
        this.Carro_id = Carro_id;
    }

    public bool ValidarDadosFavorito()
    {
        if (Usuario_id <= 0 || Carro_id <= 0)
        {
            return false;
        }
        return true;
    }
};