public class Usuario
{
    public int Id { get; init; }
    public string ?Nome { get; init; }
    public string ?Email { get; init; }
    public string ?Senha { get; init; }
    public string ?Telefone { get; init; }
    public string ?Estado { get; init; }
    public string ?Cidade { get; init; }
    public string ?Cpf { get; init; }

    public Usuario() { }

    public Usuario(string nome, string email, string senha, string telefone, string estado, string cidade, string cpf)
    {
        Nome = nome;
        Email = email;
        Senha = senha;
        Telefone = telefone;
        Estado = estado;
        Cidade = cidade;
        Cpf = cpf;
    }

    public bool ValidarDadosUsuario()
    {
        if (string.IsNullOrWhiteSpace(Nome) ||
            string.IsNullOrWhiteSpace(Email) ||
            string.IsNullOrWhiteSpace(Senha) ||
            string.IsNullOrWhiteSpace(Telefone) ||
            string.IsNullOrWhiteSpace(Estado) ||
            string.IsNullOrWhiteSpace(Cidade) ||
            string.IsNullOrWhiteSpace(Cpf))
        {
            return false;
        }
        return true;
    }
}