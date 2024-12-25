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
6. Rode os testes automatizados (opcional):
```bash
npm test
```
7. Inicie o servidor:
```bash
npm run start:dev
```
O projeto estará disponível em http://localhost:3000.
