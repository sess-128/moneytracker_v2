
# syntax=docker/dockerfile:1.7

# =========================
# BUILD STAGE
# =========================
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Gradle Wrapper
COPY gradlew ./
COPY gradle/ gradle/

# Gradle configuration
COPY build.gradle.kts settings.gradle.kts ./

RUN chmod +x gradlew

# Download dependencies and cache Gradle
RUN --mount=type=cache,id=moneytracker-gradle,target=/root/.gradle \
    ./gradlew dependencies --no-daemon

# Application sources
COPY src/ src/

# Build executable JAR
RUN --mount=type=cache,id=moneytracker-gradle,target=/root/.gradle \
    ./gradlew bootJar --no-daemon && \
    JAR=$(find build/libs -maxdepth 1 -name '*.jar' ! -name '*-plain.jar' -print -quit) && \
    test -n "$JAR" && \
    cp "$JAR" /app/app.jar


# =========================
# RUNTIME STAGE
# =========================
FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

# Create non-root user
RUN groupadd --system --gid 10001 appgroup && \
    useradd --system --uid 10001 \
        --gid appgroup \
        --no-create-home appuser

# Copy application JAR
COPY --from=build --chown=10001:10001 /app/app.jar app.jar

# Run as non-root
USER 10001:10001

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
