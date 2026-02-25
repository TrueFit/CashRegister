# =============================================================================
# Stage 1: Build React frontend
# =============================================================================
FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# =============================================================================
# Stage 2: Build .NET API
# =============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build

WORKDIR /src

# Copy solution and project files first for layer caching
COPY CashRegister.sln ./
COPY src/CashRegister.Core/CashRegister.Core.csproj src/CashRegister.Core/
COPY src/CashRegister.API/CashRegister.API.csproj src/CashRegister.API/
COPY src/CashRegister.Tests/CashRegister.Tests.csproj src/CashRegister.Tests/

RUN dotnet restore

# Copy all source and run tests
COPY src/ src/
RUN dotnet test src/CashRegister.Tests --configuration Release --no-restore

# Publish the API
RUN dotnet publish src/CashRegister.API --configuration Release --no-restore -o /app/publish

# =============================================================================
# Stage 3: Runtime
# =============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

# Copy published .NET API
COPY --from=api-build /app/publish ./

# Copy React production build into wwwroot (served by UseStaticFiles)
COPY --from=client-build /app/client/dist ./wwwroot/

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "CashRegister.API.dll"]
