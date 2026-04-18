using MySql.Data.MySqlClient;

public class CarroService
{
    private readonly MySqlConnectionFactory _connectionFactory;

    public CarroService(MySqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public List<Carro> Listar()
    {
        var lista = new List<Carro>();

        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "SELECT id, chassi, modelo, marca, ano, cor, descricao, preco FROM Carro";
            var cmd = new MySqlCommand(query, conn);

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new Carro
                    {
                        Id = reader.GetInt32("id"),
                        Chassi = reader.GetString("chassi"),
                        Modelo = reader.GetString("modelo"),
                        Marca = reader.GetString("marca"),
                        Ano = reader.GetInt32("ano"),
                        Cor = reader.GetString("cor"),
                        Descricao = reader.GetString("descricao"),
                        Preco = reader.GetDecimal("preco")
                    });
                }
            }
        }

        return lista;
    }

    public void Cadastrar(Carro carro)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "INSERT INTO Carro (chassi, modelo, marca, ano, cor, descricao, preco) VALUES (@chassi, @modelo, @marca, @ano, @cor, @descricao, @preco)";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@chassi", carro.Chassi);
            cmd.Parameters.AddWithValue("@modelo", carro.Modelo);
            cmd.Parameters.AddWithValue("@marca", carro.Marca);
            cmd.Parameters.AddWithValue("@ano", carro.Ano);
            cmd.Parameters.AddWithValue("@cor", carro.Cor);
            cmd.Parameters.AddWithValue("@descricao", carro.Descricao);
            cmd.Parameters.AddWithValue("@preco", carro.Preco);

            cmd.ExecuteNonQuery();
        }
    }

    public void Deletar(int id)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "DELETE FROM Carro WHERE id = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }

    public void Atualizar(int id, Carro carro)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "UPDATE Carro SET chassi = @chassi, modelo = @modelo, marca = @marca, ano = @ano, cor = @cor, descricao = @descricao, preco = @preco WHERE id = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@chassi", carro.Chassi);
            cmd.Parameters.AddWithValue("@modelo", carro.Modelo);
            cmd.Parameters.AddWithValue("@marca", carro.Marca);
            cmd.Parameters.AddWithValue("@ano", carro.Ano);
            cmd.Parameters.AddWithValue("@cor", carro.Cor);
            cmd.Parameters.AddWithValue("@descricao", carro.Descricao);
            cmd.Parameters.AddWithValue("@preco", carro.Preco);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }
}