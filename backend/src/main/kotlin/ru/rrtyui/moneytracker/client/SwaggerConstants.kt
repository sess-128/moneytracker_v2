package ru.rrtyui.moneytracker.client

object SwaggerConstants {
    /** TAGS **/
    const val ANALYTICS_API = "Аналитика"

    /** SHARED **/
    const val CATEGORY_IDS = "Идентификаторы категорий"
    const val MIN_AMOUNT = "Минимальная сумма"
    const val MAX_AMOUNT = "Максимальная сумма"

    /** DESCRIPTIONS **/
    const val ANALYTICS_DESCRIPTION = "Получение сводных данных для анализа трат и аналитики"
    const val ANALYTICS_GET_SUMMARY = "Обзорная аналитика за период"
    const val ANALYTICS_GET_TYPED_SUMMARY = "Подробная аналитика за период"
    const val ANALYTICS_GET_SUMMARY_BY_FILTER = "Получить все транзакции пользователя по заданным фильтрам"


    const val ANALYTICS_START_DATE = "Начальная дата периода фильтрации"
    const val ANALYTICS_END_DATE = "Конечная дата периода фильтрации"
    const val ANALYTICS_YEARS = "Список годов с аналитическими данными"
    const val ANALYTICS_YEAR = "Год"
    const val ANALYTICS_MONTHS = "Список месяцев за год"
    const val ANALYTICS_MONTH = "Месяц (число от 1 до 12)"
    const val ANALYTICS_SUMMARY = "Сводные данные за период"
    const val ANALYTICS_INCOME = "Общая сумма доходов"
    const val ANALYTICS_EXPENSE = "Общая сумма расходов"
    const val ANALYTICS_SAVINGS = "Сумма накоплений"
    const val ANALYTICS_BALANCE = "Баланс(остаток) за период"
    const val ANALYTICS_TYPED_SUMMARY = "Сводная аналитика по выбранному типу"
    const val ANALYTICS_TRANSACTIONS = "Список транзакций, сгруппированных по категориям"
    const val ANALYTICS_CATEGORY_NAME = "Название категории"
    const val ANALYTICS_ITEMS = "Список транзакций категории"
    const val ANALYTICS_TRANSACTION_ID = "Уникальный идентификатор транзакции"
    const val ANALYTICS_CATEGORY_ID = "Идентификатор категории"
    const val ANALYTICS_TRANSACTION_AMOUNT = "Сумма транзакции"
    const val ANALYTICS_TRANSACTION_DESCRIPTION = "Описание транзакции"
    const val ANALYTICS_TRANSACTION_DATE = "Дата и время транзакции"
    const val ANALYTICS_SUM = "Общая сумма за выбранный период"
    const val ANALYTICS_PERCENTAGE = "Процент от общей суммы за выбранный период"
    const val ANALYTICS_MAX_FOR_MONTH = "Максимальная сумма за месяц"
    const val ANALYTICS_AVERAGE = "Средняя сумма за выбранный период"
}