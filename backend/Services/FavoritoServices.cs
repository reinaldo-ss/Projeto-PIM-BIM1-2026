using MySql.Data.MySqlClient;

public class FavoritoService
{
    private readonly MySqlConnectionFactory _connectionFactory;

    public FavoritoService(MySqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public List<Favorito> Listar()
    {
        var lista = new List<Favorito>();

        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "SELECT id_favorito, usuario_id, carro_id, data_favorito FROM Favorito";
            var cmd = new MySqlCommand(query, conn);

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new Favorito
                    {
                        Id_favorito = reader.GetInt32("id_favorito"),
                        Usuario_id = reader.GetInt32("usuario_id"),
                        Carro_id = reader.GetInt32("carro_id"),
                        Data_favorito = reader.GetDateTime("data_favorito")
                    });
                }
            }
        }

        return lista;
    }

    public void Cadastrar(Favorito favorito)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "INSERT INTO Favorito (usuario_id, carro_id, data_favorito) VALUES (@usuario_id, @carro_id, @data_favorito)";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario_id", favorito.Usuario_id);
            cmd.Parameters.AddWithValue("@carro_id", favorito.Carro_id);
            cmd.Parameters.AddWithValue("@data_favorito", favorito.Data_favorito);

            cmd.ExecuteNonQuery();
        }
    }

    public void Deletar(int id)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "DELETE FROM Favorito WHERE id_favorito = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }

    public void Atualizar(int id, Favorito favorito)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "UPDATE Favorito SET usuario_id = @usuario_id, carro_id = @carro_id, data_favorito = @data_favorito WHERE id_favorito = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario_id", favorito.Usuario_id);
            cmd.Parameters.AddWithValue("@carro_id", favorito.Carro_id);
            cmd.Parameters.AddWithValue("@data_favorito", favorito.Data_favorito);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }
}