package ru.rrtyui.moneytracker

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
	fromApplication<MoneyTrackerApplication>().with(TestcontainersConfiguration::class).run(*args)
}
