-- Seleciona o banco antes de popular os dados iniciais.
USE pdv_supermercado;

-- Insere o catalogo base e atualiza registros existentes caso o seed rode novamente.
INSERT INTO products (name, category, barcode, price, stock)
VALUES
  ('Coca-Cola 350ml', 'Bebidas', '7894900011517', 4.50, 50),
  ('Pao de Acucar', 'Padaria', '7891000100103', 2.20, 30),
  ('Leite Integral 1L', 'Laticinios', '7891025301513', 6.80, 25),
  ('Arroz Tipo 1 5kg', 'Mercearia', '7896006716112', 28.90, 18),
  ('Feijao Carioca 1kg', 'Mercearia', '7893500025213', 8.75, 40),
  ('Sabonete Suave', 'Higiene', '7891150067014', 3.90, 60)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  price = VALUES(price),
  stock = VALUES(stock);
