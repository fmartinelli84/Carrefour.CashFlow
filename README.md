# Carrefour CashFlow

Aplicação para controle de fluxo de caixa.

## Desenho da Solução

O desenho geral dessa aplicação pode ser encontrado no diagrama abaixo:

![Desenho da Solução](Carrefour%20-%20Desenho%20da%20Solu%C3%A7%C3%A3o.png "Desenho da Solução")

## Compilação e Execução

Todos os pré-requisitos para compilar e executar a aplicação estão nos containers, para executar basta rodar o comando abaixo na pasta raiz da solution:

```
docker-compose up
```
Também é possível utilizar o Visual Studio 2022, basta abrir o arquivo ```Carrefour.CashFlow.sln```.

## Acesso

Segue abaixo uma descrição de cada container:

- **carrefour.cashflow.web**: Aplicação Angular, esse container executa o comando "ng serve", se algum arquivo fonte for alterado o site vai recompilar automaticamente. 
Obs, o primeiro acesso pode demorar alguns segundos, até a compilação ser concluída.
  - **Endereço**: http://localhost:55900

- **carrefour.cashflow.api**: Swagger das APIs. Obs, o primeiro acesso aos containers **carrefour.cashflow.api** e **carrefour.cashflow.jobs** pode dar erro se o Bando de Dados ainda não estiver disponível, execute novamente se isso ocorrer.
  - **Endereço**: https://localhost:55901/swagger

- **carrefour.cashflow.jobs**: Dashboard do Hangfire para administração dos jobs que executam em background. Nesse site é possível forçar a execução imediata de um Job agendado.
  - **Endereço**: https://localhost:55902/jobs

- **carrefour.cashflow.logging**: Dashboard do Seq Log para visualização dos logs. Ex, pesquise por ProcessName = "Consolidated.Generate" para visualizar somente os logs do Gerador dos Consolidados. 
  - **Endereço**: http://localhost:55903

- **carrefour.cashflow.database**: Banco de Dados MS SQL Server 2022 Developer Edition.
  - **Server**: localhost:1433
  - **Database**: CashFlow
  - **User**: sa
  - **Password**: D93A1FBF9756
