# Vitrine Motors 

Vitrine Motors é um sistema de gerenciamento de concessionárias projetado para funcionar como uma plataforma web moderna e intuitiva para a visualização de veículos online. O sistema atua como uma extensão digital da loja física, permitindo que os clientes explorem modelos, acessem informações detalhadas e interajam de forma simples e eficiente.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido aplicando conceitos de Programação Orientada a Objetos (POO) e arquitetura de software moderna.

* **Back-end:** C# com ASP.NET Core 

 
* **Front-end:** HTML5, CSS3, JavaScript 


* **Banco de Dados:** MySQL (Modelo Relacional) 


* **Acessibilidade:** Integração com o VLibras Widget para suporte à Língua Brasileira de Sinais.



## ⚙️ Principais Funcionalidades

O sistema é dividido para atender tanto os clientes finais quanto a administração da concessionária:

### Para Usuários/Clientes

* **Catálogo Digital:** Visualização de todos os veículos disponíveis na concessionária com imagens detalhadas, preços, ano e quilometragem.


* **Busca e Filtros:** Funcionalidades para pesquisar veículos por marca ou modelo, facilitando a tomada de decisão.


* **Gestão de Conta:** Cadastro de usuários, login seguro e edição de perfil.


* **Favoritos:** Sistema para favoritar e desfavoritar veículos de interesse.


* **Contato Direto:** Botão integrado para iniciar conversas e agendar test drives via WhatsApp diretamente com a concessionária.



### Para Administradores

* **Painel Administrativo:** Acesso restrito para gerenciar o estoque.


* **Gerenciamento de Veículos (CRUD):** Cadastro de novos carros (com upload de múltiplas imagens), listagem, atualização de dados e remoção de veículos vendidos.


* **Relatórios:** Geração de relatórios organizados sobre os veículos cadastrados no sistema.



## 🗄️ Arquitetura e Banco de Dados

O projeto utiliza um banco de dados relacional (MySQL) projetado para garantir a integridade referencial através de chaves estrangeiras (`FOREIGN KEY`) e atributos únicos (`UNIQUE`).

A arquitetura do código C# demonstra evidências claras dos pilares da Orientação a Objetos:

* **Encapsulamento:** Propriedades seguras com validação interna de dados nas classes de modelo.


* **Polimorfismo:** Implementação de construtores para inicialização flexível de objetos.


* **Herança:** Utilização da classe base `ControllerBase` do ASP.NET para as rotas da API.



## 👥 Equipe Desenvolvedora

Projeto Integrado Multidisciplinar (PIM) desenvolvido para o curso de Análise e Desenvolvimento de Sistemas da Universidade Paulista - UNIP.

* Henrique Jose Tezzei da Silva 


* Natan Silva 


* Rafael Stefaneli 


* Reinaldo da Silva Santana Filho 
