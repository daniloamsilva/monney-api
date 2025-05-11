#  MonneyAPI
Um projeto feito em NestJS para o backend do aplicativo web [MonneyApp](https://github.com/daniloamsilva/monney-app).

## 🚀 Tecnologias utilizadas
Este projeto é desenvolvido com as seguintes tecnologias:
- [NestJS](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/pt-BR/)

## ⚙️ Configuração e Execução
Siga os passos abaixo para rodar o projeto localmente:
1. Clone o repositório:
```bash
git clone https://github.com/daniloamsilva/monney-api.git
```
2. Acesse o diretório do projeto
```bash
cd monney-api
```
3. Instale as dependências:
```bash
npm install
```
4. Crie o arquivo .env:
```bash
cp .env.example .env
```
5. Inicie os containers Docker:
```bash
docker compose up -d
```
6. Rode as migrations
```bash
npm run migration:up
```
7. Rode os testes automatizados (opcional):
```bash
npm test
```
8. Inicie o servidor:
```bash
npm run start:dev
```
O projeto estará disponível em http://localhost:3000.

## 🐳 Serviços Docker
Este projeto utiliza um ambiente Docker com os seguintes serviços definidos no [compose.yml](compose.yaml):

📦 database: Container principal do PostgreSQL usado pela aplicação.
- Imagem: postgres:17.2-alpine3.21
- Porta Exposta: ${DB_PORT}:5432
- Variáveis de Ambiente: definidas via .env (DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)

🧪 test-database: Instância separada do PostgreSQL utilizada exclusivamente para testes.
- Imagem: postgres:17.2-alpine3.21
- Porta Exposta: ${DB_TEST_PORT}:5432
- Importante: Usa as mesmas credenciais e banco da instância principal, mas escuta em uma porta diferente para evitar conflitos.

⚡ redis: Servidor Redis para cache ou fila de mensagens.
- Imagem: redis:7.4-alpine
- Porta Exposta: ${REDIS_PORT}:6379
- Senha: definida via variável REDIS_PASSWORD (recomenda-se manter segura no .env)
- Configuração Extra: Utiliza --requirepass para exigir autenticação

📬 mailpit: Servidor SMTP fake e visualizador de emails para desenvolvimento.
- Imagem: axllent/mailpit:latest
- Portas Expostas:
- Interface Web: 8025
- SMTP: ${MAIL_PORT}:1025
