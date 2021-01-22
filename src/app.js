const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // Recebendo as informações do corpo da requisição
  const { title, url, techs } = request.body;

  // Criando o novo registro
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  // Adicionando na lista de registros
  repositories.push(repository);

  // Retornando o registro criado
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // Recebendo as informações do corpo da requisição
  const { title, url, techs } = request.body;

  // Pegando o identificador
  const { id } = request.params;

  // Atualizando o registro
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verificando se o repositório existe
  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository does not exist." });

  // Atualizando os dados do repositório
  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  // Pegando o identificador
  const { id } = request.params;

  // Verificando a existência do repositório na lista
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository does not exist." });

  // Caso exista, fazemos a remoção do mesmo
  repositories.splice(repositoryIndex, 1);

  // E retornamos o sucesso na requisição
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verificando se o repositório existe
  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository does not exist." });

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
