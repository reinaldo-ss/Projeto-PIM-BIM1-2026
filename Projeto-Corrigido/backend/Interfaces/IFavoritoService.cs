using System.Collections.Generic;

public interface IFavoritoService
{
    List<Favorito> Listar();
    List<Carro> ListarPorUsuario(int usuarioId);
    void Cadastrar(Favorito favorito);
    void Deletar(int carroId, int usuarioId);
    void Atualizar(int id, Favorito favorito);
}