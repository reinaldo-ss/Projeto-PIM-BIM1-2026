-- ============================================================
--  VitrineMotors — Script de criação do banco de dados
--  Compatível com XAMPP (MySQL / MariaDB) + phpMyAdmin
-- ============================================================

-- Criação e seleção do banco
CREATE DATABASE IF NOT EXISTS vitrinemotors
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE vitrinemotors;

-- ============================================================
-- Tabela: Usuario
-- ============================================================
CREATE TABLE IF NOT EXISTS Usuario (
  id       INT          AUTO_INCREMENT PRIMARY KEY,
  nome     VARCHAR(255) NOT NULL,
  cpf      VARCHAR(14)  NOT NULL,
  email    VARCHAR(255) NOT NULL UNIQUE,
  senha    VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  estado   VARCHAR(50),
  cidade   VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: Carro
-- ============================================================
CREATE TABLE IF NOT EXISTS Carro (
  id        INT            AUTO_INCREMENT PRIMARY KEY,
  chassi    VARCHAR(17)    NOT NULL UNIQUE,
  modelo    VARCHAR(100)   NOT NULL,
  marca     VARCHAR(100)   NOT NULL,
  ano       INT            NOT NULL,
  cor       VARCHAR(50)    NOT NULL,
  descricao TEXT,
  preco     DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: Imagem  (FK → Carro.chassi)
-- ============================================================
CREATE TABLE IF NOT EXISTS Imagem (
  id_imagem     INT          AUTO_INCREMENT PRIMARY KEY,
  chassi        VARCHAR(17)  NOT NULL,
  caminho_imagem VARCHAR(255) NOT NULL,
  tipo_imagem   VARCHAR(50)  NOT NULL,
  CONSTRAINT fk_carro_imagem
    FOREIGN KEY (chassi) REFERENCES Carro(chassi)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índice para agilizar buscas por chassi
CREATE INDEX idx_imagem_chassi ON Imagem(chassi);

-- ============================================================
-- Tabela: Favorito  (FK → Usuario.id  e  Carro.id)
-- ============================================================
CREATE TABLE IF NOT EXISTS Favorito (
  id_favorito  INT       AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT       NOT NULL,
  carro_id     INT       NOT NULL,
  data_favorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_favorito
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_carro_favorito
    FOREIGN KEY (carro_id) REFERENCES Carro(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para agilizar buscas por usuário e por carro
CREATE INDEX idx_favorito_usuario ON Favorito(usuario_id);
CREATE INDEX idx_favorito_carro   ON Favorito(carro_id);

-- INSERTS PARA USAR DE TESTE
INSERT IGNORE INTO usuario (nome, email, senha, cpf, telefone, estado, cidade) VALUES
('Fernanda Rocha', 'fernanda@email.com', '789012', '12345678900', '31999991234', 'MG', 'Belo Horizonte');

INSERT IGNORE INTO usuario (nome, email, senha, cpf, telefone, estado, cidade) VALUES
('Rodrigo Alves', 'rodrigo@email.com', 'password', '98765432100', '41988884321', 'PR', 'Curitiba');

INSERT IGNORE INTO usuario (nome, email, senha, cpf, telefone, estado, cidade) VALUES
('Juliana Mendes', 'juliana@email.com', 'abc123', '45678912399', '51977778765', 'RS', 'Porto Alegre'); 