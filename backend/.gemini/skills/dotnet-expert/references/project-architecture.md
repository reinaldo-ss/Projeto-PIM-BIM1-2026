# Arquitetura do Projeto VitrineMotors

Este projeto segue uma estrutura multicamadas simplificada para uma API .NET.

## Estrutura de Pastas
- `Controller/`: Contém os controladores de API que gerenciam as requisições HTTP. Ex: `UsuarioController.cs`.
- `Services/`: Contém a lógica de negócio principal. Os controladores chamam estas classes. Ex: `UsuarioServices.cs`.
- `Data/`: Contém a infraestrutura de dados. O `MySqlConnectionFactory.cs` gerencia a conexão com o banco MySQL.
- `Model/`: Contém as classes de entidade (POCOs) que representam as tabelas do banco de dados. Ex: `Usuario.cs`.
- `wwwroot/img/carros/`: Diretório para armazenamento de imagens estáticas dos veículos.

## Fluxo de Dados Comum
1. O Cliente faz uma requisição HTTP.
2. O `Controller` recebe a requisição e valida o básico.
3. O `Controller` chama o `Service` correspondente.
4. O `Service` executa a lógica e usa o `MySqlConnectionFactory` para interagir com o banco de dados.
5. O `Service` retorna o resultado (ou erro) para o `Controller`.
6. O `Controller` envia a resposta HTTP final.

## Convenções de Código
- **Linguagem**: C# (utilizando recursos modernos do .NET 8/10).
- **Banco de Dados**: MySQL.
- **Nomenclatura**: PascalCase para classes e métodos, camelCase para variáveis locais.
- **Injeção de Dependência**: Configurada no `Program.cs`.
