using MySql.Data.MySqlClient;

public class ImagemService : ServiceBase, IImagemService
{
    public ImagemService(MySqlConnectionFactory connectionFactory) : base(connectionFactory)
    {
    }

    public List<Imagem> Listar()
    {
        var lista = new List<Imagem>();

        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "SELECT id, chassi, caminho_imagem, tipo_imagem FROM Imagem";
            var cmd = new MySqlCommand(query, conn);

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new Imagem
                    {
                        Id = reader.GetInt32("id"),
                        Chassi = reader.GetString("chassi"),
                        Caminho_imagem = reader.GetString("caminho_imagem"),
                        Tipo_imagem = reader.GetString("tipo_imagem")
                    });
                }
            }
        }

        return lista;
    }

    public void Cadastrar(Imagem imagem)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "INSERT INTO Imagem (chassi, caminho_imagem, tipo_imagem) VALUES (@chassi, @caminho_imagem, @tipo_imagem)";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@chassi", imagem.Chassi);
            cmd.Parameters.AddWithValue("@caminho_imagem", imagem.Caminho_imagem);
            cmd.Parameters.AddWithValue("@tipo_imagem", imagem.Tipo_imagem);

            cmd.ExecuteNonQuery();
        }
    }

    public void Deletar(int id)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "DELETE FROM Imagem WHERE id = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }

    public void Atualizar(int id, Imagem imagem)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "UPDATE Imagem SET chassi = @chassi, caminho_imagem = @caminho_imagem, tipo_imagem = @tipo_imagem WHERE id = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@chassi", imagem.Chassi);
            cmd.Parameters.AddWithValue("@caminho_imagem", imagem.Caminho_imagem);
            cmd.Parameters.AddWithValue("@tipo_imagem", imagem.Tipo_imagem);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }
}