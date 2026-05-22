using MySql.Data.MySqlClient;

public abstract class ServiceBase
{
    protected readonly MySqlConnectionFactory _connectionFactory;

    protected ServiceBase(MySqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }
}