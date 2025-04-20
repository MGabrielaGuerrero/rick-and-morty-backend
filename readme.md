# Rick and Morty Backend GraphQL API

This project is a backend API built with **Node.js**, **Express**, **GraphQL**, **Sequelize**, and **Redis**, which allows querying information about characters, locations, and episodes from the Rick and Morty series.

Data is synchronized from the [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) and stored in a relational database (MySQL). Redis caching is also implemented to enhance performance.

---

## 🚀 Technologies Used

- Node.js + TypeScript  
- Express  
- Apollo Server (GraphQL)  
- Sequelize ORM (MySQL)  
- Redis (caching)  
- Docker + Docker Compose  
- Jest (testing)  
- Swagger (REST documentation)  

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/MGabrielaGuerrero/rick-and-morty-backend.git
cd rick-and-morty-backend
```

### 2. Create a `.env` file
```env
NODE_ENV=development
PORT=4000

DB_USER=admin
DB_PASS=prueba1704
DB_NAME=rickandmorty
DB_HOST=db # localhost or db
DB_PORT=3306
DB_DIALECT=mysql

REDIS_HOST=redis # localhost or redis
REDIS_PORT=6379
REDIS_PASS=

AUTH_TOKEN=my-secret-token

GRAPHQL_URL=https://rickandmortyapi.com/graphql
SWAGGER_URL=http://localhost:4000
```

### 3. Start services using Docker Compose
```bash
docker-compose up --build
```

> This will start the API at:  
> - GraphQL: http://localhost:4000/graphql  
> - Swagger Docs: http://localhost:4000/docs

---

## 🧱 Sequelize CLI Commands

> Make sure to configure `config/config.js` or use `sequelize-typescript` properly with ts-node.

### Create the database
```bash
npx sequelize-cli db:create
```

### Run migrations
```bash
npx sequelize-cli db:migrate
```

### Run seeders (populate data from external API)
```bash
npx sequelize-cli db:seed:all
```

### Undo last migration
```bash
npx sequelize-cli db:migrate:undo
```

### Undo all seeders
```bash
npx sequelize-cli db:seed:undo:all
```

> ⚠️ If you use TypeScript, you can configure `.sequelizerc` to read `.ts` files using `ts-node`.

---

## 🧪 Run tests
```bash
npm install
npm run test
```

---

## 🧠 Using the API (GraphQL)

### Required headers
```
Authorization: Bearer my-secret-token
Content-Type: application/json
```

### Query example: search characters with filters
```graphql
{
  "query": "query {\n  characters(filter: { name: \"rick\", status: \"Alive\" }) {\n    id\n    name\n    status\n    gender\n    species\n  }\n}\n "
}
```

### Get character by ID
```graphql
{
  "query": "query getCharacter($id: Int!) {\n  character(id: $id) {\n    id\n    name\n    status\n    species\n    gender\n    originLocation { id name }\n    currentLocation { id name }\n  }\n}\n",
  "variables": {
    "id": 8
  }
}
```

### Get all locations
```graphql
{
  "query": "query { locations { id name type dimension created residents } }"
}
```

### Get location by ID
```graphql
{
  "query": "query getLocation($id: Int!) { location(id: $id) { id name type dimension } }",
  "variables": {
    "id": 1
  }
}
```

### Get episode by ID
```graphql
{
  "query": "query getEpisode($id: Int!) { episodesByIds(ids: [$id]) { id name air_date episode } }",
  "variables": {
    "id": 1
  }
}
```

### Get all episodes
```graphql
{
  "query": "query { episodes { id name air_date episode created  characters } }"
}
```

---

## 🔄 Automatic Synchronization

The project includes a **cron job** that synchronizes all data every 12 hours from the public API.

---

## 🔐 Authentication

All requests require an authorization header:
```
Authorization: Bearer my-secret-token
```
> You can change this token in your `.env` or `docker-compose.yml` file.

---

## 📂 Project Structure
```
src/
├── database/         # Sequelize models
├── graphql/          # Schemas and resolvers
├── jobs/             # Cron sync logic
├── middleware/       # Authentication
├── services/         # Business logic
├── docs/             # Swagger documentation
└── app.ts            # Entry point
```

---

## 🧠 Author
Developed by [Maria Gabriela Guerrer](https://github.com/MGabrielaGuerrero/rick-and-morty-backend.git) as a technical challenge.



