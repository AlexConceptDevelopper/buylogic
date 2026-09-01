# Étape 1 : Build de l'application avec Maven
FROM eclipse-temurin:24-jdk AS build
WORKDIR /app
COPY buylogic/ .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Étape 2 : Exécution de l'application
FROM eclipse-temurin:24-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]