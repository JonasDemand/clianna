FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy everything
COPY . ./

# Change the working directory to /App/Api
WORKDIR /App/Api

# Needed for google api to work
ENV DOTNET_SYSTEM_NET_HTTP_SOCKETSHTTPHANDLER_HTTP3SUPPORT=true

# Restore as distinct layers
RUN dotnet restore

# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App

# Copy the published output from the build stage
COPY --from=build-env /App/Api/out .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]
