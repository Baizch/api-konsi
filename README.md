# API de Consulta de Benefícios

## Descrição do Projeto

Este projeto consiste em uma API e uma interface web desenvolvidas para consultar e retornar os benefícios associados a um determinado CPF. O objetivo principal é resolver o seguinte desafio:

> A Konsi coleta uma variedade de dados que não são facilmente acessíveis, para propor melhores opções de crédito para seus clientes. Um dos tipos de dados coletados é o número da matrícula e código do tipo do benefício do aposentado ou pensionista.
>
> O desafio é fazer uma API que busque e retorne a matrícula do servidor em uma determinada API externa.
>
> Será necessário desenvolver uma aplicação para coletar esse dado na API externa, uma API para fazer input e buscar o resultado depois.

---

## Funcionalidades

### **1. Gerar Token**
- **Endpoint:** `POST /api/v1/generate-token`
- **Descrição:** Gera um token na API de teste da Konsi.
- **Parâmetros:**
  - Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Resposta:**
  ```json
  {
      "success": "boolean",
      "data": {
          "token": "string",
          "type": "string",
          "expiresIn": "string"
      }
  }

### 2. Consultar Benefícios
- **Endpoint:** `GET /api/v1/get-benefits?cpf={cpf}`
- **Descrição:** Retorna os benefícios associados ao CPF informado, consultando a API externa da Konsi.
- **Parâmetros:**
  - Query:
    ```json
    "cpf": "string"
    
- Resposta:
  ```json
  {
      "success": "boolean",
      "data": [
          {
              "benefits": [
                  {
                      "numero_beneficio": "string",
                      "codigo_tipo_beneficio": "string"
                  }
              ]
          }
      ]
  }

## Requisitos para execução
Antes de começar, certifique-se de ter:
- Docker Desktop instalado.
- Um arquivo .env configurado na raiz das pastas backend e frontend.

### Como Rodar o Projeto
1. **Clone o repositório**

    ```bash
    git clone git@github.com:Baizch/app-konsi.git
    
    cd app-konsi
    ```
2. **Execute o comando de inicialização**
    ```bash
   npm start
    ```
    Este comando irá:
     - Construir os containers do frontend, backend, Redis, ElasticSearch e RabbitMQ.
     - Iniciar a aplicação e o envio de CPFs para a fila do RabbitMQ.
     - Começar o processamento dos CPFs, deixando a aplicação pronta para consumo pelo frontend.

3. **Acesse os Serviços**
Após a inicialização:
    - A API estará disponível em: http://localhost:3000
    - O frontend estará disponível em:
      - http://localhost:5173
      - Ou http://172.19.0.6:5173/ se preferir acessar pelo IP.
     
## Tecnologias Utilizadas
- **Backend:** Node.js, Express, Redis, RabbitMQ, ElasticSearch.
- **Frontend:** React.js.
- **Infraestrutura:** Docker.

## Autor
### Franco Baisch - Desenvolvedor FullStack
