using System.Collections.Generic;

public interface ICarroService
{
    List<Carro> Listar();
    List<Carro> BuscarPorNome(string termo);
    void Cadastrar(Carro carro);
    void Deletar(int id);
    void Atualizar(int id, Carro carro);
};