#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Carrefour.CashFlow.Api/Carrefour.CashFlow.Api.csproj", "Carrefour.CashFlow.Api/"]
COPY ["Carrefour.CashFlow.Business/Carrefour.CashFlow.Business.csproj", "Carrefour.CashFlow.Business/"]
COPY ["Carrefour.CashFlow.Data/Carrefour.CashFlow.Data.csproj", "Carrefour.CashFlow.Data/"]
COPY ["Carrefour.CashFlow.Entities/Carrefour.CashFlow.Entities.csproj", "Carrefour.CashFlow.Entities/"]
COPY ["Carrefour.CashFlow.Dtos/Carrefour.CashFlow.Dtos.csproj", "Carrefour.CashFlow.Dtos/"]
COPY ["Carrefour.Framework/Carrefour.Framework.csproj", "Carrefour.Framework/"]
RUN dotnet restore "Carrefour.CashFlow.Api/Carrefour.CashFlow.Api.csproj"
COPY . .
WORKDIR "/src/Carrefour.CashFlow.Api"
RUN dotnet build "Carrefour.CashFlow.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Carrefour.CashFlow.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Carrefour.CashFlow.Api.dll"]