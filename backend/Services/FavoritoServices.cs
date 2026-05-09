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
                    });
                }
            }
        }

        return lista;
    }

    // Adicione este método dentro do seu FavoritoService
    public List<Carro> ListarPorUsuario(int usuarioId)
    {
        var lista = new List<Carro>();

        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = @"
                SELECT c.id, c.chassi, c.modelo, c.marca, c.ano, c.cor, c.descricao, c.preco, i.caminho_imagem 
                FROM Carro c 
                INNER JOIN Favorito f ON c.id = f.carro_id 
                LEFT JOIN Imagem i ON c.chassi = i.chassi AND i.tipo_imagem = 'FotoFrente'
                WHERE f.usuario_id = @usuarioId";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuarioId", usuarioId);

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    var carro = new Carro
                    {
                        Id = reader.GetInt32("id"),
                        Chassi = reader.GetString("chassi"),
                        Modelo = reader.GetString("modelo"),
                        Marca = reader.GetString("marca"),
                        Ano = reader.GetInt32("ano"),
                        Cor = reader.GetString("cor"),
                        // Descricao = reader.GetString("descricao"), // Se tiver descrição no seu model Carro
                        Preco = reader.GetDecimal("preco")
                    };

                    if (!reader.IsDBNull(reader.GetOrdinal("caminho_imagem")))
                    {
                        carro.CaminhoImagem = reader.GetString("caminho_imagem");
                    }

                    lista.Add(carro);
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

            var query = "INSERT INTO Favorito (usuario_id, carro_id) VALUES (@usuario_id, @carro_id)";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario_id", favorito.Usuario_id);
            cmd.Parameters.AddWithValue("@carro_id", favorito.Carro_id);

            cmd.ExecuteNonQuery();
        }
    }

    public void Deletar(int usuarioId, int carroId)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "DELETE FROM Favorito WHERE usuario_id = @usuarioID AND carro_id = @carroID";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuarioID", usuarioId);
            cmd.Parameters.AddWithValue("@carroID", carroId);

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
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }
}