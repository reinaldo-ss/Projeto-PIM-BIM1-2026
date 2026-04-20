using MySql.Data.MySqlClient;

public class UsuarioService
{
    private readonly MySqlConnectionFactory _connectionFactory;

    public UsuarioService(MySqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public List<Usuario> Listar()
    {
        var lista = new List<Usuario>();

        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "SELECT id, nome, email, senha, telefone, estado, cidade FROM Usuario";
            var cmd = new MySqlCommand(query, conn);

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new Usuario
                    {
                        Id = reader.GetInt32("id"),
                        Nome = reader.GetString("nome"),
                        Email = reader.GetString("email"),
                        Senha = reader.GetString("senha"),
                        Telefone = reader.GetString("telefone"),
                        Estado = reader.GetString("estado"),
                        Cidade = reader.GetString("cidade")
                    });
                }
            }
        }

        return lista;
    }

    public void Cadastrar(Usuario usuario)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "INSERT INTO Usuario (nome, email, senha, telefone, estado, cidade) VALUES (@nome, @email, @senha, @telefone, @estado, @cidade)";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nome", usuario.Nome);
            cmd.Parameters.AddWithValue("@email", usuario.Email);
            cmd.Parameters.AddWithValue("@senha", usuario.Senha);
            cmd.Parameters.AddWithValue("@telefone", usuario.Telefone);
            cmd.Parameters.AddWithValue("@estado", usuario.Estado);
            cmd.Parameters.AddWithValue("@cidade", usuario.Cidade);

            cmd.ExecuteNonQuery();

        }
    }

    public void Deletar(int id)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "DELETE FROM Usuario WHERE id = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }

    public void Atualizar(int id, Usuario usuario)
    {
        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = "UPDATE Usuario SET nome = @nome, email = @email, senha = @senha, telefone = @telefone, estado = @estado, cidade = @cidade WHERE id = @id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nome", usuario.Nome);
            cmd.Parameters.AddWithValue("@email", usuario.Email);
            cmd.Parameters.AddWithValue("@senha", usuario.Senha);
            cmd.Parameters.AddWithValue("@telefone", usuario.Telefone);
            cmd.Parameters.AddWithValue("@estado", usuario.Estado);
            cmd.Parameters.AddWithValue("@cidade", usuario.Cidade);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
        }
    }
};