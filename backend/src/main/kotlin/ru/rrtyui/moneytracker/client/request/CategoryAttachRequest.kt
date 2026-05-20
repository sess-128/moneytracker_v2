package ru.rrtyui.moneytracker.client.request

data class CategoryAttachRequest(
    val parentName: String,
    val childName: String
)
