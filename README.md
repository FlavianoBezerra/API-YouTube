# Clone da Interface do YouTube - Back-End

Este projeto é o back-end de um clone da interface do YouTube, construído com **Node.js** e **TypeScript**. Ele oferece funcionalidades de login, gerenciamento de usuários e vídeos, e interage com um banco de dados PostgreSQL.

- Você pode acessar o repositório do front-end do projeto [aqui](https://github.com/FlavianoBezerra/YouTube-Project).

## Estrutura do Projeto

A estrutura do diretório do projeto é organizada da seguinte maneira:

- **dist**: Pasta para o build do projeto.  
- **node_modules**: Pasta que armazena as dependências do projeto.  
- **src**: Pasta contendo o código fonte do projeto.  
  - **middleware**: Pasta com as funções de middleware.  
    - **login.ts**: Arquivo de login.  
  - **migrations**: Pasta com as migrations para criação das tabelas do banco de dados.  
    - **20241218031425_create_users_table.ts**: Migration para criação da tabela de usuários.  
    - **20241218031538_create_videos_table.ts**: Migration para criação da tabela de vídeos.  
  - **modules**: Pasta com os módulos do projeto.  
    - **user/repositories**: Pasta com os repositórios de usuários.  
      - **userRepository.ts**: Arquivo com o repositório de usuários.  
    - **videos/repositories**: Pasta com os repositórios de vídeos.  
      - **videosRepository.ts**: Arquivo com o repositório de vídeos.  
  - **routes**: Pasta com as rotas do projeto.  
    - **user.routes.ts**: Arquivo com as rotas de usuário.  
    - **videos.routes.ts**: Arquivo com as rotas de vídeos.  
  - **knexfile.ts**: Arquivo de configuração do Knex, utilizado para definir as conexões com o banco de dados e as configurações de migrations.  
  - **migrate.ts**: Script para rodar as migrations utilizando o Knex.    
  - **server.ts**: Arquivo com a lógica do servidor.  
- **.env**: Arquivo de variáveis de ambiente.  
- **.gitignore**: Arquivo com os arquivos a serem ignorados pelo Git.  
- **LICENSE**: Arquivo de licença do projeto.  
- **package-lock.json**: Arquivo que descreve as dependências do projeto e suas versões.  
- **package.json**: Arquivo que descreve as dependências do projeto e seus scripts.  
- **tsconfig.json**: Arquivo de configuração do Typescript.
- **vercel.json**: Arquivo de configuração do Vercel para definir as rotas, ambientes e outras configurações necessárias para o deploy da aplicação.

## Instalação

### Pré-requisitos

Certifique-se de ter os seguintes itens instalados no seu ambiente de desenvolvimento:

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- PostgreSQL (ou outro banco de dados configurado)

### Passos para Instalar

1. Clone o repositório:

    ```bash
    git clone https://github.com/FlavianoBezerra/API-YouTube.git
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Crie o arquivo `.env` na raiz do projeto e configure suas variáveis de ambiente:

    ```env
    SECRET=xxxxxxxxxxxxx
    DATABASE_URL=xxxxxxx
    FRONTEND_URL=xxxxxxx
    ```

4. Compile o projeto TypeScript:

    ```bash
    npm run build
    ```

5. Inicie o servidor:

    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:4000`.

## Funcionalidades

### Autenticação:

- Registro de usuários.
- Login com token JWT.

### Vídeos:

- Upload de vídeos.
- Listar vídeos.
- Visualizar detalhes de vídeos.

## Rotas

### Usuários

- **POST /sign-up**: Registra um novo usuário.
- **POST /sign-in**: Realiza o login do usuário.
- **GET /get-user**: Obtém as informações de um usuário.

### Vídeos

- **POST /create-video/:user_id**: Faz o upload de um vídeo.
- **GET /get-video/:user_id**: Obtém vídeos do usuário.
- **GET /search-video**: Lista todos os vídeos.

## Scripts

Este projeto contém os seguintes scripts:

- **test**: Executa um comando de erro indicando que não há testes especificados.

    ```bash
    npm run test
    ```

- **dev**: Inicia o servidor no modo de desenvolvimento usando `ts-node-dev`, que permite recarregar automaticamente o servidor quando houver mudanças no código.

    ```bash
    npm run dev
    ```

- **clean**: Remove o diretório `dist` utilizando `rimraf` para limpar os arquivos de build.

    ```bash
    npm run clean
    ```

- **build**: Compila o código TypeScript para JavaScript no diretório `dist`.

    ```bash
    npm run build
    ```

- **start**: Inicia o servidor compilado (JavaScript) a partir da pasta `dist`.

    ```bash
    npm start
    ```

- **migrate**: Executa o script de migrations utilizando `ts-node` para rodar o arquivo `src/migrate.ts`.

    ```bash
    npm run migrate
    ```


## Dependências

O projeto utiliza as seguintes dependências principais:

- **bcrypt**: Biblioteca para hashing de senhas.
- **cors**: Middleware para habilitar o Cross-Origin Resource Sharing.
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.
- **express**: Framework web para Node.js.
- **jsonwebtoken**: Biblioteca para trabalhar com JSON Web Tokens (JWT).
- **knex** Biblioteca para construção de consultas SQL.
- **mysql**: Driver para MySQL.
- **pg** Driver para PostgreSQL.
- **uuid**: Geração de identificadores únicos universais.

### Dependências de Desenvolvimento

- **@types/bcrypt**: Tipagens para o `bcrypt`.
- **@types/cors**: Tipagens para o `cors`.
- **@types/express**: Tipagens para o `express`.
- **@types/jsonwebtoken**: Tipagens para o `jsonwebtoken`.
- **@types/knex** Tipos TypeScript para a biblioteca `knex`.
- **@types/mysql**: Tipagens para o `mysql`.
- **@types/node** Tipos TypeScript para o ambiente Node.js.
- **@types/uuid**: Tipagens para o `uuid`.
- **nodemon**: Ferramenta para reiniciar o servidor automaticamente durante o desenvolvimento.
- **ts-node** Executa código TypeScript diretamente no Node.js.
- **ts-node-dev**: Compilador para TypeScript com recarga dinâmica no desenvolvimento.
- **tsconfig-paths** Resolução de caminhos personalizados no TypeScript.
- **typescript**: O compilador TypeScript.

## Possíveis Alterações Futuras

- Adicionar suporte a comentários em vídeos.
- Implementar sistema de likes e dislikes.
- Adicionar suporte a categorias e recomendações de vídeos.

## Licença

Este projeto está licenciado sob a Licença MIT – veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Criado por [Flaviano Bezerra](https://www.linkedin.com/in/flaviano-bezerra-5203bb333).
