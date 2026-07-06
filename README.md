# Contrato de API - Servidor para Gerenciamento de Biblioteca

## BookSense

### Equipe

-   Caio Augusto Faria Machado
-   Iury Gonçalves de Souza
-   Yan Gabardo Souza

## Endpoints

  Método   Endpoint     Entrada                     Resposta        Status
  -------- ------------ --------------------------- --------------- -----------------
  GET      `/`          \-                          Página HTML     200
  GET      `/livros`    `tipo` (query)              Lista em JSON   200
  POST     `/login`     `usuario`, `senha` (body)   OK / Erro       200 / 401
  POST     `/reserva`   `id` (body)                 Confirmação     201 / 400 / 404

## Decisões de projeto

-   `tipo` vai na query URL porque é um filtro público de busca.
-   `usuario` e `senha` vão em formato JSON porque são dados privados.
-   `/reserva` responde:
    -   **201** quando a reserva é realizada com sucesso;
    -   **400** quando o livro existe, mas já está reservado por outra
        pessoa;
    -   **404** quando o livro não existe.
-   Os dados serão guardados em um vetor na memória e serão perdidos
    quando o servidor for reiniciado.

## Casos de teste

  ---------------------------------------------------------------------------------
  \#                      Requisição                        Esperado
  ----------------------- --------------------------------- -----------------------
  1                       `GET /livros`                     200 --- Lista completa
                                                            (9 itens)

  2                       `GET /livros?tipo=infantil`       200 --- Somente os 3
                                                            livros infantis

  3                       `GET /livros?tipo=estrangeiro`    200 --- Lista vazia
                                                            `[]`

  4                       `POST /login` com                 200 --- Sucesso
                          `adm / booksense123`              

  5                       `POST /login` com senha errada    401 --- Erro

  6                       `POST /reserva`                   201 --- "Diário de um
                          `{ "id": 4, "aluno": "Mosca" }`   Banana" diminui um no
                                                            estoque

  7                       `POST /reserva` sem o campo       400 --- Erro de
                          `aluno`                           validação

  8                       `POST /reserva`                   404 --- Livro não
                          `{ "id": 99, ... }`               existente

  9                       `POST /reserva`                   400 --- Estoque
                          `{ "id": 6, ... }`                insuficiente
  ---------------------------------------------------------------------------------
