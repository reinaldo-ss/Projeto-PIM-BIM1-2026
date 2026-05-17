using System.Collections.Generic;

public interface ICarroService
{
    List<Carro> Listar();
    void Cadastrar(Carro carro);
    void Deletar(int id);
    void Atualizar(int id, Carro carro);
};