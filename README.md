# Sistema PDV

Aplicacao web de PDV para supermercado com:

- login de operador e cadastro de usuario
- busca de produtos
- carrinho de compras
- escolha de forma de pagamento
- calculo de troco
- finalizacao de venda
- historico de vendas

O layout foi inspirado na referencia em `screens/home.jpeg`.

## Estrutura

```text
PDV/
|- backend/
|  |- database/
|  |- src/
|  `- tests/
|- frontend/
|  `- src/
`- screens/
```

## Stack

- Backend: Node.js, Express, MySQL, Vitest, Supertest
- Frontend: React, Vite, Axios, React Router, Bootstrap

## Requisitos

- Node.js 20+
- npm 10+
- MySQL 8+ (opcional para execucao em modo real)

## Configuracao

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
```

Variaveis importantes:

- `PORT`: porta da API
- `STORAGE_MODE=auto`: tenta MySQL e faz fallback para memoria se o banco nao estiver disponivel
- `STORAGE_MODE=mysql`: exige MySQL ativo
- `STORAGE_MODE=memory`: usa apenas dados em memoria
- `AUTH_SECRET`: segredo usado para assinar os tokens de autenticacao

### 2. Banco MySQL

Crie o banco e popule dados iniciais nesta ordem:

```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seed.sql;
```

Se preferir executar pelo terminal do MySQL:

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

Por padrao o frontend aponta para:

```env
VITE_API_URL=http://localhost:3333/api
```

## Como rodar

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

Depois abra o endereco informado pelo Vite, normalmente `http://localhost:5173`.

## Autenticacao

No primeiro acesso, abra a tela inicial e use a aba `Cadastro` para criar um operador com:

- nome
- email
- senha

Depois disso, o login libera o acesso ao PDV e ao historico. As rotas `/api/products` e `/api/sales/*`
passam a exigir token Bearer valido.

## Fluxo principal

1. Entre com um operador existente ou cadastre um novo usuario.
2. Busque um produto pelo nome, categoria ou codigo de barras.
3. Adicione itens ao carrinho.
4. Escolha a forma de pagamento.
5. Em dinheiro, informe o valor recebido ou use os atalhos.
6. Finalize a venda.
7. Acesse `Historico` para consultar as vendas registradas.

## Endpoints da API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health`
- `GET /api/products?q=texto`
- `GET /api/sales/summary`
- `GET /api/sales/history`
- `POST /api/sales`

Exemplo de payload para venda:

```json
{
  "paymentMethod": "dinheiro",
  "amountReceived": 20,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

## Validacoes executadas

Durante esta entrega foram executados:

- `cd backend && npm test`
- `cd frontend && npm run build`
- smoke test HTTP do backend com `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` e `GET /api/products`

## Observacoes

- Em `STORAGE_MODE=memory`, os dados reiniciam ao subir o backend.
- Em `STORAGE_MODE=auto`, a API continua funcional mesmo se o MySQL estiver indisponivel.
- A autenticacao usa token assinado pelo backend e hash de senha persistido no repositorio configurado.
- O frontend e responsivo, mas a composicao visual foi pensada principalmente para operacao desktop, como na referencia.
