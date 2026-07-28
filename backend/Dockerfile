# Etapa de construcción (Build)
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copiamos el wrapper de Maven y el pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Damos permisos de ejecución al wrapper
RUN chmod +x mvnw

# Descargamos las dependencias (mejora el caché de Docker)
RUN ./mvnw dependency:go-offline

# Copiamos el código fuente y compilamos
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa de ejecución (Run)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiamos el .jar compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
