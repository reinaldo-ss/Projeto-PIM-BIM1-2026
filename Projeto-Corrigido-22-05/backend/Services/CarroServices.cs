using MySql.Data.MySqlClient;

public class CarroService : ServiceBase, ICarroService
{
    public CarroService(MySqlConnectionFactory connectionFactory) : base(connectionFactory)
    {
    }

    public List<Carro> Listar()
    {
        var lista = new List<Carro>();

        using (var conn = _connectionFactory.CreateConnection())
        {
            conn.Open();

            var query = @"SELECT c.id, c.chassi, c.modelo, c.marca, c.ano, c.cor, c.descricao, c.preco,
                          i1.caminho_imagem AS FotoFrente,
                          i2.caminho_imagem AS FotoTraseira,
                          i3.caminho_imagem AS FotoLateralDireita, 
                          i4.caminho_imagem AS FotoLateralEsquerda
                          FROM Carro c
                          LEFT JOIN Imagem i1 ON c.chassi = i1.chassi AND i1.tipo_imagem = 'FotoFrente'
                          LEFT JOIN Imagem i2 ON c.chassi = i2.chassi AND i2.tipo_imagem = 'FotoTraseira'
                          LEFT JOIN Imagem i3 ON c.chassi = i3.chassi AND i3.tipo_imagem = 'FotoLateralDireita'
                          LEFT JOIN Imagem i4 ON c.chassi = i4.chassi AND i4.tipo_imagem = 'FotoLateralEsquerda'";
            
            var cmd = new MySqlCommand(query, conn);

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
                        Descricao = reader.GetString("descricao"),
                        Preco = reader.GetDecimal("preco"),

                        FotoFrente = reader.IsDBNull(reader.GetOrdinal("FotoFrente")) ? null : reader.GetString("FotoFrente"),
                        FotoTraseira = reader.IsDBNull(reader.GetOrdinal("FotoTraseira")) ? null : reader.GetString("FotoTraseira"),
                        FotoLateralDireita = reader.IsDBNull(reader.GetOrdinal("FotoLateralDireita")) ? null : reader.GetString("FotoLateralDireita"),
                        FotoLateralEsquerda = reader.IsDBNull(reader.GetOrdinal("FotoLateralEsquerda")) ? null : reader.GetString("FotoLateralEsquerda")
                    };
                    
                    lista.Add(carro);
                }
            }
        }

        return lista;
    }

    public List<Carro> BuscarPorNome(string termo)
    {
        var lista = new List<Carro>();

        using var conexao = _connectionFactory.CreateConnection();
        conexao.Open();

        var query = @"SELECT c.id, c.chassi, c.modelo, c.marca, c.ano, c.cor, c.descricao, c.preco,
                          i1.caminho_imagem AS FotoFrente,
                          i2.caminho_imagem AS FotoTraseira,
                          i3.caminho_imagem AS FotoLateralDireita, 
                          i4.caminho_imagem AS FotoLateralEsquerda
                          FROM Carro c
                          LEFT JOIN Imagem i1 ON c.chassi = i1.chassi AND i1.tipo_imagem = 'FotoFrente'
                          LEFT JOIN Imagem i2 ON c.chassi = i2.chassi AND i2.tipo_imagem = 'FotoTraseira'
                          LEFT JOIN Imagem i3 ON c.chassi = i3.chassi AND i3.tipo_imagem = 'FotoLateralDireita'
                          LEFT JOIN Imagem i4 ON c.chassi = i4.chassi AND i4.tipo_imagem = 'FotoLateralEsquerda'
                          WHERE CONCAT(c.modelo, ' ', c.marca) LIKE @termo";
        using var comando = new MySqlCommand(query, conexao);

        comando.Parameters.AddWithValue("@termo", $"%{termo}%");

        using var reader = comando.ExecuteReader();
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
                Descricao = reader.GetString("descricao"),
                Preco = reader.GetDecimal("preco"),

                FotoFrente = reader.IsDBNull(reader.GetOrdinal("FotoFrente")) ? null : reader.GetString("FotoFrente"),
                FotoTraseira = reader.IsDBNull(reader.GetOrdinal("FotoTraseira")) ? null : reader.GetString("FotoTraseira"),
                FotoLateralDireita = reader.IsDBNull(reader.GetOrdinal("FotoLateralDireita")) ? null : reader.GetString("FotoLateralDireita"),
                FotoLateralEsquerda = reader.IsDBNull(reader.GetOrdinal("FotoLateralEsquerda")) ? null : reader.GetString("FotoLateralEsquerda")
            };

            lista.Add(carro);    
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