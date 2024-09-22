# :checkered_flag: SCOLA - Sistema Centralizado de Organização e Logística Acadêmica

Um sistema de administração escolar. 
Abrange turmas e avisos.

## :technologist: Membros da equipe

Maurício Campos de Sousa - 470385 - Design Digital.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação


• Alunos
• Professores
• Administradores

## :spiral_calendar: Entidades ou tabelas do sistema

• Usuários (User)
• Avisos (Notice)
• Disciplinas (Subject)
• Papel no sistema (Role)

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

Matrícula em disciplinas - 

    Administrador poderá cadastrar, visualizar, atualizar e deletar usuários - alunos e professores.
    Administrador poderá cadastrar, visualizar, atualizar e deletar disciplinas.
    Administrador poderá adicionar participantes a uma disciplina.

Visualização de disciplinas  -

    Aluno pode acessar as disciplinas em que está cadastrado - poderá ver participantes e noticias cadastradas.
    Professor pode cadastrar Avisos nas disciplinas em que está cadastrado.

----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Vue, VueRouter, Pinia, Axios, Bootstrap

**Backend:**

Express, Sqlite, TypeORM 


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade | Criação | Leitura | Atualização | Remoção |
|----------|---------|---------|-------------|---------|
| User     |    X    |    X    |      X      |    X    |
| Notice   |    X    |         |             |         |
| Subject  |    X    |    X    |      X      |    X    |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | /users/|
| POST | /users/|
| GET | /users/:id|
| PUT | /users/:id|
| DELETE | /users/:id|

| GET | /subjects/|
| POST | /subjects/|
| GET | /subjects/:id|
| PUT | /subjects/:id|
| DELETE | /subjects/:id|

| POST | /notices/:subjectId|
| DELETE | /notices/:id|
