-- Cria o banco usado pelo backend quando o modo MySQL estiver ativo.
CREATE DATABASE IF NOT EXISTS pdv_supermercado;
USE pdv_supermercado;

-- Cadastro base de produtos disponiveis para consulta e venda.
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  barcode VARCHAR(32) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Operadores que podem acessar o PDV para consultar produtos e registrar vendas.
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cabecalho da venda com totais e forma de pagamento.
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_method ENUM('dinheiro', 'credito', 'debito', 'pix') NOT NULL,
  amount_received DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  change_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itens detalhados de cada venda, separados para manter historico completo.
CREATE TABLE IF NOT EXISTS sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_items_sale
    -- Se a venda for removida, seus itens tambem devem sair para evitar lixo logico.
    FOREIGN KEY (sale_id) REFERENCES sales(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product
    -- Mantem integridade referencial com o produto original vendido.
    FOREIGN KEY (product_id) REFERENCES products(id)
);
