package ru.rrtyui.moneytracker

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MoneyTrackerApplication

fun main(args: Array<String>) {
	runApplication<MoneyTrackerApplication>(*args)
}
