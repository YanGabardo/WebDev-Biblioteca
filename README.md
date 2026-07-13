# Contrato de API - Servidor para Gerenciamento de Biblioteca

## BookSense

### Equipe

- Caio Augusto Faria Machado
- Iury Gonçalves de Souza
- Yan Gabardo Souza

## Endpoints

| Método | Endpoint | Entrada | Resposta | Status |
|:-------:|:--------|:---------|:----------|:------:|
| GET | `/` | — | Página HTML | `200` |
| GET | `/livros` | `tipo` (query URL) | Lista em JSON | `200` |
| POST | `/login` | `usuario`, `senha` (body JSON) | OK / Erro | `200` / `401` |
| POST | `/reserva` | `id` (body JSON) | Confirmação | `201` / `400` / `404` |

## Decisões de Projeto

- `tipo` vai na query URL pois é um filtro público de busca.
- `usuario` e `senha` são enviados em JSON porque são dados privados.
- `/reserva` responde:
  - **201** quando a reserva é realizada com sucesso;
  - **400** quando o livro existe, mas já está reservado ou sem estoque;
  - **404** quando o livro não existe.
- Os dados serão armazenados em um vetor na memória e serão perdidos quando o servidor for reiniciado.

## Casos de Teste

| # | Requisição | Resultado Esperado |
|:-:|:-----------|:-------------------|
| 1 | `GET /livros` | `200` — Lista completa (9 itens). |
| 2 | `GET /livros?tipo=infantil` | `200` — Apenas os 3 livros infantis. |
| 3 | `GET /livros?tipo=estrangeiro` | `200` — Lista vazia `[]`. |
| 4 | `POST /login` com `adm / booksense123` | `200` — Login realizado com sucesso. |
| 5 | `POST /login` com senha incorreta | `401` — Erro de autenticação. |
| 6 | `POST /reserva` com `{ "id": 4, "aluno": "Mosca" }` | `201` — "Diário de um Banana" reduz o estoque em 1 unidade. |
| 7 | `POST /reserva` sem o campo `aluno` | `400` — Erro de validação. |
| 8 | `POST /reserva` com `{ "id": 99, ... }` | `404` — Livro não encontrado. |
| 9 | `POST /reserva` com `{ "id": 6, ... }` | `400` — Estoque insuficiente. |
