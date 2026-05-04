# Sistema PDV para supermercado

Este ExecPlan e um documento vivo. Ele deve ser atualizado durante a execucao para refletir o que foi decidido, implementado, validado e aprendido.

## Purpose / Big Picture

Construir um sistema web de PDV para supermercado com duas areas principais:

- tela operacional de venda (busca de produtos, carrinho, pagamento, calculo de troco e finalizacao)
- historico de vendas com consulta das vendas realizadas

O sistema deve ser composto por:

- backend Node.js com Express
- banco MySQL com scripts de schema e seed
- frontend React com Vite
- integracao HTTP via Axios
- navegacao com React Router
- interface baseada visualmente na referencia `screens/home.jpeg`

## Progress

- [x] Ler o ExecPlan original, inspecionar o workspace e analisar a referencia visual em `screens/home.jpeg`
- [x] Reestruturar o repositorio em `backend/` e `frontend/`, com configuracoes iniciais e scripts de desenvolvimento
- [x] Implementar backend Express com rotas de saude, produtos, vendas, resumo diario e historico
- [x] Modelar persistencia MySQL com schema, seed e camada de acesso configuravel por ambiente
- [x] Implementar regras de negocio de carrinho, totalizacao, pagamento, troco e persistencia de vendas
- [x] Construir frontend React com layout inspirado na referencia, rotas `PDV` e `Historico`, e integracao real com a API
- [x] Integrar frontend e backend com estados de carregamento, erros, resumo diario e fluxo completo de finalizacao
- [x] Criar `README.md` com requisitos, configuracao, estrutura, scripts e fluxo de uso
- [x] Executar validacoes tecnicas (testes backend, build frontend e smoke checks do fluxo principal) e registrar resultados
- [x] Preencher `Outcomes & Retrospective` com o que foi entregue, limites atuais e proximos cuidados

## Surprises & Discoveries

- O repositorio iniciou praticamente vazio, sem estrutura de frontend, backend ou banco; o projeto precisou ser bootstrapado do zero.
- A referencia visual mostra um fluxo desktop-first com tres colunas, abas `PDV` e `Historico`, e foco grande em rapidez operacional.
- O ambiente desta sessao bloqueou execucao direta de processos Node em alguns comandos com erro `EPERM` ao resolver `C:\Users\fabio`; para contornar isso, o build final do frontend e o smoke test HTTP precisaram ser executados fora do sandbox.
- Para garantir demonstracao e testes locais mesmo sem MySQL ativo, foi necessario implementar fallback automatico em memoria no backend.

## Decision Log

- A aplicacao sera organizada em dois projetos separados, `backend/` e `frontend/`, para manter scripts e dependencias independentes.
- O backend usara uma camada de repositorio com alternancia entre MySQL real e modo em memoria para facilitar desenvolvimento, testes e recuperacao quando o banco nao estiver disponivel.
- O schema MySQL sera entregue via scripts SQL versionados em `backend/database/`.
- O frontend usara Bootstrap como base, mas com CSS customizado para aproximar o layout da referencia ao inves de usar componentes genericos prontos.
- O historico sera implementado como segunda rota do React Router, mantendo a mesma casca visual do painel principal.
- A API foi definida com contratos REST simples (`/api/health`, `/api/products`, `/api/sales/summary`, `/api/sales/history`, `/api/sales`) para reduzir acoplamento e simplificar integracao com Axios.
- O backend foi coberto com testes automatizados em modo `memory`, validando saude, busca de produtos, criacao de venda e regra de troco.

## Outcomes & Retrospective

Entrega concluida com os seguintes resultados:

- Backend Express funcional com rotas de produtos, resumo diario, historico e criacao de vendas.
- Persistencia preparada para MySQL real via `schema.sql` e `seed.sql`.
- Fallback em memoria implementado para desenvolvimento, testes e recuperacao.
- Frontend React com Vite entregue com duas rotas (`PDV` e `Historico`) e integracao real com a API.
- Layout final alinhado ao conceito da referencia: cabecalho, alternancia de abas, coluna de produtos, carrinho central e painel de pagamento.
- `README.md` criado com setup, scripts, endpoints e fluxo de uso.

Limites atuais e cuidados futuros:

- O historico ainda nao possui filtros por periodo ou operador.
- O frontend foi pensado prioritariamente para desktop, embora responda em telas menores.
- Em ambiente real de producao, convem evoluir autenticacao, auditoria de operador e controle transacional mais avancado para estoque.

## Context and Orientation

O projeto comeca praticamente do zero.

Existe uma pasta chamada `screens` com imagem de referencia:

- `screens/home.jpeg`

Essa imagem serve como base visual para a tela principal do PDV. O sistema final nao precisa ser uma copia pixel-perfect, mas deve preservar:

- cabecalho com indicadores do dia
- alternancia entre `PDV` e `Historico`
- coluna de produtos com busca e cards
- coluna central para carrinho e resumo da venda
- coluna lateral para pagamento e finalizacao

## Plan of Work

1. Estruturar o monorepo leve com diretorios `backend/` e `frontend/`, definindo scripts, arquivos de ambiente de exemplo e convencoes de pastas.
2. Implementar o backend Express com configuracao centralizada, rotas REST, servicos de negocio e repositorios.
3. Criar o schema MySQL com tabelas de produtos, vendas e itens de venda, incluindo seed para demonstracao.
4. Implementar o frontend React com rotas, componentes de lista de produtos, carrinho, pagamento e historico.
5. Integrar a UI a API com Axios, cobrindo busca de produtos, resumo diario, criacao de venda e listagem de historico.
6. Documentar instalacao e uso no `README.md`.
7. Executar validacoes tecnicas, registrar evidencias neste plano e fechar o retrospecto final.

## Concrete Steps

1. Criar estrutura de pastas e `package.json` em `backend/` e `frontend/`.
2. Definir contratos da API:
   - `GET /api/health`
   - `GET /api/products?q=`
   - `GET /api/sales/summary`
   - `GET /api/sales/history`
   - `POST /api/sales`
3. Implementar configuracao do backend com leitura de ambiente e resolucao do modo de persistencia.
4. Implementar repositorios:
   - repositorio de produtos
   - repositorio de vendas
   - repositorio em memoria para fallback/testes
5. Implementar validacoes de payload de venda:
   - pelo menos um item
   - quantidade positiva
   - forma de pagamento suportada
   - valor recebido obrigatorio para dinheiro
6. Implementar calculos:
   - subtotal por item
   - total geral
   - troco
   - quantidade de vendas e faturamento do dia
7. Criar scripts SQL de schema e seed.
8. Construir o frontend:
   - shell principal
   - pagina `PDV`
   - pagina `Historico`
   - hooks de API
   - componentes de produtos, carrinho e pagamento
9. Ajustar o visual com base na referencia `screens/home.jpeg`.
10. Criar `README.md`.
11. Rodar testes e build, corrigir problemas encontrados e registrar o resultado neste documento.

## Validation and Acceptance

O trabalho sera considerado aceito quando todos os pontos abaixo estiverem verdadeiros:

- O backend iniciar sem erro com `npm run dev` ou `npm start` em `backend/`.
- O frontend iniciar sem erro com `npm run dev` e gerar build com `npm run build` em `frontend/`.
- A API responder `200` em `GET /api/health`.
- A listagem de produtos permitir busca textual por nome, categoria ou codigo de barras.
- O frontend permitir adicionar e remover itens do carrinho.
- O frontend calcular total em tempo real.
- O frontend permitir escolher forma de pagamento e calcular troco para pagamentos em dinheiro.
- O usuario conseguir finalizar uma venda e ver a venda refletida no historico.
- O `README.md` explicar como configurar MySQL, como rodar em modo fallback e quais scripts executar.
- As validacoes executadas devem ser registradas no final deste plano.

Resultado da validacao:

- `cd backend && npm test` executado com sucesso: 4 testes aprovados.
- `cd frontend && npm run build` executado com sucesso.
- Smoke test HTTP executado com sucesso em backend rodando localmente:
  - `GET /api/health` respondeu com `storageMode=memory`
  - `GET /api/products?q=leite` retornou 1 produto
  - `POST /api/sales` criou a venda `#1`
  - `GET /api/sales/history` retornou 1 venda registrada

## Idempotence and Recovery

- O projeto deve poder ser reinstalado com `npm install` em `backend/` e `frontend/` sem depender de arquivos gerados manualmente.
- Se o MySQL nao estiver disponivel, o backend deve poder operar em modo em memoria para demonstracao e testes locais.
- Os scripts SQL devem ser reaplicaveis em banco novo, seguindo a ordem `schema.sql` e depois `seed.sql`.
- Se uma etapa falhar, retomar pelo item ainda nao marcado no `Progress`, registrando a falha em `Surprises & Discoveries`.
- Toda decisao tecnica nova ou ajuste de escopo deve ser documentado em `Decision Log`.

## Artifacts and Notes

- Referencia visual: `screens/home.jpeg`
- Entregaveis esperados:
  - `backend/`
  - `frontend/`
  - scripts SQL
  - `README.md`

## Interfaces and Dependencies

Stack alvo:

- Node.js
- Express
- MySQL
- React com Vite
- Axios
- React Router
- Bootstrap

Dependencias tecnicas previstas:

- backend: `express`, `cors`, `dotenv`, `mysql2`, `nodemon`, `vitest`, `supertest`
- frontend: `react`, `react-dom`, `vite`, `axios`, `react-router-dom`, `bootstrap`, `bootstrap-icons`
