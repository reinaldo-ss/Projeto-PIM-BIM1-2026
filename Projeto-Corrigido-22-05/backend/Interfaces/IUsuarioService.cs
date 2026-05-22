using System.Collections.Generic;

public interface IUsuarioService
{
    List<Usuario> Listar();
    void Cadastrar(Usuario usuario);
    void Deletar(int id);
    void Atualizar(int id, Usuario usuario);
    Usuario ValidarLogin(string email, string senha);
}