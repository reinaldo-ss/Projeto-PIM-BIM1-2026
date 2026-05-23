using System.Collections.Generic;

public interface IImagemService
{
    List<Imagem> Listar();
    void Cadastrar(Imagem imagem);
    void Deletar(int id);
    void Atualizar(int id, Imagem imagem);
};