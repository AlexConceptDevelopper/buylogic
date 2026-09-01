# Étape 1 : Build de l'application
FROM eclipse-temurin:24-jdk-jammy AS build
WORKDIR /app

# Copie tout le contenu du dossier du projet Spring Boot (pom.xml, src, mvnw, etc.) dans /app
COPY buylogic/ .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Étape 2 : Exécution de l'application
FROM eclipse-temurin:24-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]