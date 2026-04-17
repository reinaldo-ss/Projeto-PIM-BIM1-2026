CREATE DATABASE IF NOT EXISTS projeto_carros;
USE projeto_carros;

-- TABELA USUARIO

CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    estado VARCHAR(2),         
    cidade VARCHAR(100)
);

-- TABELA CARRO (sem placa, com chassi e cor)

CREATE TABLE IF NOT EXISTS carro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chassi VARCHAR(17) NOT NULL UNIQUE,   
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano INT,
    cor VARCHAR(30),
    preco DECIMAL(10,2),
    descricao TEXT
);

-- TABELA IMAGEM (chassi como FK, sem legenda, com tipo_imagem)

CREATE TABLE IF NOT EXISTS imagem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chassi VARCHAR(17) NOT NULL,
    caminho_imagem VARCHAR(255) NOT NULL,
    tipo_imagem VARCHAR(20),  
    FOREIGN KEY (chassi) REFERENCES carro(chassi) ON DELETE CASCADE
);

-- TABELA FAVORITO (com ID próprio, sem chave composta)

CREATE TABLE IF NOT EXISTS favorito (
    id_favorito INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    carro_id INT NOT NULL,
    data_favorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (carro_id) REFERENCES carro(id) ON DELETE CASCADE
);

-- Usuários (incluindo estado e cidade)
INSERT IGNORE INTO usuario (nome, email, senha, telefone, estado, cidade) VALUES
('Ana Souza', 'ana@email.com', '123456', '(11) 98888-7777', 'SP', 'São Paulo'),
('Carlos Lima', 'carlos@email.com', '654321', '(21) 97777-6666', 'RJ', 'Rio de Janeiro');

-- Carros (com chassi e cor)
INSERT IGNORE INTO carro (chassi, modelo, marca, ano, cor, preco, descricao) VALUES
('9BWZZZ377VT004251', 'Civic', 'Honda', 2021, 'Prata', 95000.00, 'Sedã completo, ar condicionado, direção elétrica'),
('1HGCM82633A123456', 'Corolla', 'Toyota', 2022, 'Branco', 110000.00, 'Híbrido, bancos de couro'),
('8AP1K5B5XLD123456', 'Onix', 'Chevrolet', 2020, 'Preto', 55000.00, '1.0 Turbo, econômico');

-- Imagens (usando chassi como referência)
INSERT IGNORE INTO imagem (chassi, caminho_imagem, tipo_imagem) VALUES
('9BWZZZ377VT004251', 'uploads/civic_frente.jpg', 'exterior'),
('9BWZZZ377VT004251', 'uploads/civic_lateral.jpg', 'lateral'),
('1HGCM82633A123456', 'uploads/corolla_2022.jpg', 'exterior'),
('8AP1K5B5XLD123456', 'uploads/onix_preto.jpg', 'exterior');

-- Favoritos (com id_favorito automático)
INSERT IGNORE INTO favorito (usuario_id, carro_id, data_favorito) VALUES
(1, 1, NOW()),
(1, 3, NOW()),
(2, 2, NOW());
