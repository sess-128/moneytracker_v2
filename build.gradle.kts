plugins {
	alias { libs.plugins.kotlin.jvm }
	alias { libs.plugins.kotlin.spring }
	alias { libs.plugins.springBoot }
	alias { libs.plugins.dependencyManagement }
}

group = "ru.rrtyui.moneytracker"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
	maven { url = uri("https://repo.spring.io/snapshot") }
}

dependencies {
	implementation(libs.springBootStarterValidation)
	implementation(libs.springBootStarterWeb)
	implementation(libs.springBootStarterJdbc)
	implementation(libs.springBootStarterSpringdocOpenapi)
	implementation(libs.springWebSecurity)
	implementation(libs.jwtTokenApi)
	implementation(libs.jwtTokenImpl)
	implementation(libs.jwtTokenJackson)

	developmentOnly(libs.springBootDockerCompose)

	implementation(libs.exposedSpringBootStarter)
	implementation(libs.exposedCore)
	implementation(libs.exposedJdbc)
	implementation(libs.exposedKotlinDatetime)

	implementation(libs.jacksonModuleKotlin)
	implementation(libs.kotlinReflect)
	runtimeOnly(libs.kotlinxCoroutinesCore)

	implementation(libs.apachePoi)

	implementation(libs.liquibaseCore)
	implementation(libs.postgresql)

	testImplementation(libs.springBootStarterTest)
	testImplementation(libs.springBootTestcontainers)
	testImplementation(libs.kotlinJUnit5)
	testImplementation(libs.testContainersJunitJupiter)
	testImplementation(libs.testContainersPostgres)
	testImplementation(libs.springWebSecurityTest)
	testRuntimeOnly(libs.junitPlatformLauncher)
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
