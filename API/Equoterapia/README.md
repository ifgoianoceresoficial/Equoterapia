# 🚀 Java API - Equoterapia

O back-end do sistema **Equoterapia** é uma API RESTful desenvolvida utilizando o ecossistema do **Spring Boot** com **Java 23**. Ela gerencia a lógica de negócios, a segurança por tokens JWT e a persistência de dados no banco relacional MySQL.

---

## 📂 Estrutura e Camadas do Projeto

O código-fonte está estruturado sob o pacote `com.equoterapia.web` e segue a arquitetura de camadas tradicional para promover a separação de responsabilidades:

- **`entities/`**: Classes Java anotadas com `@Entity` que representam a modelagem física do banco de dados (Ex: `Professional`, `Pacient`, `Horse`, `Session`). Os enums de apoio (como status e papéis de acesso) residem na subpasta `enums/`.
- **`repositories/`**: Interfaces que estendem `JpaRepository`, fornecendo suporte para operações CRUD e queries personalizadas sem necessidade de implementação manual de SQL.
- **`services/`**: Serviços anotados com `@Service` responsáveis por orquestrar as regras de negócio do sistema e as validações de integridade.
- **`resources/`**: Controladores REST anotados com `@RestController` que expõem os endpoints da API (ex: rotas sob `/professional`, `/pacients`, `/auth`).
- **`authentication/`**: Classes de segurança de autenticação baseada em JWT e autenticação de usuários via Spring Security (`UserDetailsServiceImpl`, `TokenService`, `SecurityFilter`).
- **`exceptions/`**: Exceções customizadas e o gerenciador global `ApiExceptionHandler`, que captura erros e formata respostas HTTP padronizadas.

---

## 🛠️ Pré-requisitos
Antes de iniciar, garanta que você tem instalado em sua máquina:
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Java JDK 23](https://adoptium.net/)
- [Maven 3.x](https://maven.apache.org/)

---

## 📌 Passo a Passo para Execução

### 1️⃣ Subir o Container do Banco de Dados (MySQL)
Para rodar apenas o banco MySQL via Docker (útil quando você quer executar e debugar a API na IDE localmente):
```sh
docker-compose up -d db
```
> O banco de dados estará acessível em `jdbc:mysql://localhost:3306/Equoterapia` com usuário `root` e senha `root` (configurados no `application.properties`).

### 2️⃣ Compilar e Gerar o Executável
Execute o build do Maven para compilar as classes, rodar os processos do Lombok e empacotar o arquivo `.jar`:
```sh
mvn clean package
```
> Esse comando gera o executável `target/Equoterapia-0.0.1-SNAPSHOT.jar`.

### 3️⃣ Iniciar a API no Docker
Com o `.jar` gerado e o banco em execução, suba a aplicação com:
```sh
docker-compose up -d
```
Isso iniciará o container do MySQL e o container da API Java rodando na porta `8080`.

### 4️⃣ Alternativa: Rodar a API Localmente (Sem Container App)
Caso queira desenvolver ativamente rodando pela IDE (como IntelliJ IDEA) ou pelo terminal sem recriar o container do app:
```sh
./mvnw spring-boot:run
```

---

## 🔒 Segurança e Autenticação (JWT)

A autenticação é protegida usando **Spring Security** com **JSON Web Tokens (JWT)**.
- O endpoint `/auth/login` valida o usuário e retorna um token JWT assinado.
- Esse token deve ser enviado no cabeçalho das requisições subsequentes:
  `Authorization: Bearer <SEU_TOKEN_JWT>`.
- O filtro `SecurityFilter` intercepta cada requisição HTTP privada para verificar a autenticidade e validade do token.

---

## 🧪 Testes Automatizados

Os testes automatizados foram construídos usando **JUnit 5** e **Mockito**.
- Para executar a suíte de testes:
  ```sh
  mvn test
  ```
- O ambiente de testes utiliza um banco de dados **H2 em memória**, configurado no arquivo `application-test.properties`, garantindo que os testes não afetem a integridade do banco MySQL local de desenvolvimento.

---

## 📖 Documentação da API

### Swagger / OpenAPI UI
O projeto utiliza o `SpringDoc OpenAPI` para documentar os endpoints e esquemas de dados de forma interativa.
- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON Spec:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Workspace Postman
Temos também uma coleção de requisições prontas com cenários de teste reais:
- 📌 [Postman - Testes da API](https://www.postman.com/spaceflight-geologist-17996715/workspace/equoterapia-workspace/collection/37274122-0a958160-024f-45a3-b9fa-e8a5074f3fca?action=share&creator=37274122)

---

## ⏹️ Comandos Utilitários do Docker

- **Parar os containers:** `docker-compose stop`
- **Iniciar os containers parados:** `docker-compose start`
- **Parar e remover os containers:** `docker-compose down`
- **Ver logs em tempo real da API:** `docker-compose logs -f app`