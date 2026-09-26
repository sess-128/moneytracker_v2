# POST /api/v1/categories — Создание категории

## Описание

Создаёт новую категорию или привязывает существующую к дереву пользователя. Категории глобально шареные (по имени), но дерево связей — персональное для каждого пользователя.

---

## Аутентификация

Требуется `SecurityContext`. Пользователь извлекается неявно через `ActorPrincipalService.getCurrentActor()`.

---

## Request

**Headers:**
```
Content-Type: application/json
```

**Body:**

| Поле      | Тип    | Обязательно | Описание                                     | Пример        |
|-----------|--------|-------------|----------------------------------------------|---------------|
| `name`    | String | Да          | Название категории                            | `"Продукты"`  |
| `type`    | Enum   | Да          | Тип: `EXPENSE`, `INCOME`, `SAVINGS`          | `"EXPENSE"`   |
| `parentId`| UUID   | Нет         | ID родительской категории (для подкатегорий)  | `null`        |

**Пример:**
```json
{
  "name": "Продукты",
  "type": "EXPENSE",
  "parentId": null
}
```

---

## Response

**Status:** `200 OK`

| Поле       | Тип    | Описание                                     |
|------------|--------|----------------------------------------------|
| `id`       | UUID   | ID категории (из таблицы дерева)              |
| `name`     | String | Название категории                            |
| `type`     | Enum   | Тип: `EXPENSE`, `INCOME`, `SAVINGS`          |
| `parentId` | UUID   | ID родительской категории или `null`          |

**Пример:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Продукты",
  "type": "EXPENSE",
  "parentId": null
}
```

---

## Возможные ошибки

| Статус | Причина                                              |
|--------|------------------------------------------------------|
| 401    | Пользователь не аутентифицирован                      |
| 400    | `parentId` указывает на несуществующую категорию       |
| 400    | Категория ссылается сама на себя                       |
| 400    | Обнаружена циклическая зависимость в дереве            |
| 500    | Дубликат имени категории (без уникального индекса — race condition) |

---

## Алгоритм работы

### Схема потока

```
Controller
  │
  ▼
CategoryCreateRequest.toUseCase()
  │  маппинг: CategoryCreateRequest → CategoryCreateCommand
  ▼
CategoryCreateUseCaseImpl.invoke()
  │
  ├── 1. ActorPrincipalService.getCurrentActor()
  │     Извлечение пользователя из SecurityContextHolder
  │
  ├── 2. CategoryMapper.toServiceModel()
  │     Маппинг: CategoryCreateCommand + ActorPrincipal → CategoryCreateModel
  │
  ├── 3. CategoryService.create()
  │     findOrCreate по имени:
  │       - Если категория с таким именем есть → вернуть существующую
  │       - Если нет → создать новую в БД
  │
  ├── 4. CategoryTreeService.validateParent()  [если parentId != null]
  │     Проверки:
  │       - parentId указывает на существующую категорию
  │       - категория не ссылается сама на себя
  │       - нет циклической зависимости
  │
  ├── 5. CategoryTreeService.createLink()
  │     Создание связи: userId ↔ categoryId ↔ parentCatId
  │
  └── 6. Сборка CategoryCreateResult
  │
  ▼
CategoryCreateResult.toResponse()
  │  маппинг: CategoryCreateResult → CategoryResponse
  ▼
Controller → ResponseEntity.ok(response)
```

### Детали по слоям

#### 1. Controller (`CategoryController.kt`)

```kotlin
fun createCategory(@RequestBody request: CategoryCreateRequest): ResponseEntity<CategoryResponse> {
    val params = request.toUseCase()          // Request → Command
    val result = categoryCreateUseCase.invoke(params)  // Use Case
    val response = result.toResponse()        // Command → Response
    return ResponseEntity.ok(response)
}
```

#### 2. CategoryControllerMapper (`CategoryControllerMapper.kt`)

Маппит Request → Command:
- `CategoryCreateRequest.name` → `CategoryCreateCommand.name`
- `CategoryTypeStatusRequest` → `CategoryTypeCommand` (EXPENSE/INCOME/SAVINGS)
- `CategoryCreateRequest.parentId` → `CategoryCreateCommand.parentId`

#### 3. CategoryCreateUseCaseImpl (`CategoryCreateUseCaseImpl.kt`)

Основная логика:

```kotlin
override fun invoke(params: CategoryCreateCommand): CategoryCreateResult {
    // 1. Текущий пользователь
    val actorPrincipal = actorPrincipalService.getCurrentActor()

    // 2. Маппинг в service-модель
    val categoryCreateModel = params.toServiceModel(actorPrincipal)

    // 3. find-or-create категории по имени
    val categoryServiceModel = categoryService.create(categoryCreateModel)

    // 4. Подготовка модели дерева
    val treeCreateModel = CategoryTreeCreateModel(
        categoryId = categoryServiceModel.id,
        parentId = params.parentId,
        actorId = actorPrincipal.id
    )

    // 5. Валидация родителя (если передан)
    if (params.parentId != null) {
        val validateModel = CategoryTreeValidateModel(
            categoryId = categoryServiceModel.id,
            parentId = params.parentId,
            actorId = actorPrincipal.id
        )
        categoryTreeService.validateParent(validateModel)
    }

    // 6. Создание связи в дереве
    val categoryLink = categoryTreeService.createLink(treeCreateModel)

    // 7. Сборка результата
    return CategoryCreateResult(
        id = categoryLink.id,          // ← ID связи, не категории
        name = categoryServiceModel.name,
        type = categoryServiceModel.type.toUseCase(),
        parentId = categoryLink.parentId
    )
}
```

#### 4. CategoryService.create (`CategoryServiceImpl.kt`)

```kotlin
override fun create(createModel: CategoryCreateModel): CategoryServiceModel {
    // Проверка: есть ли уже категория с таким именем?
    val existingCategory = categoryRepository.findByName(createModel.name)
    if (existingCategory != null) {
        return existingCategory.toServiceModel()   // ← вернуть существующую
    }

    // Создание новой
    val categoryCreateRow = createModel.toCategoryCreateRow()
    val createdEntity = categoryRepository.create(categoryCreateRow)
    return createdEntity.toServiceModel()
}
```

**Важно:** Категории глобальные — если "Продукты" уже есть у любого пользователя, будет возвращена та же самая запись.

#### 5. CategoryTreeService.validateParent (`CategoryTreeServiceImpl.kt`)

```kotlin
override fun validateParent(categoryTreeValidateModel: CategoryTreeValidateModel) {
    // Самоссылка
    if (categoryId == parentId) {
        throw RuntimeException("Category cannot be its own parent")
    }

    // Существование родителя
    if (!categoryTreeRepository.existById(parentId)) {
        throw RuntimeException("Parent category with id $parentId does not exist")
    }

    // Проверка циклов
    val links = categoryTreeRepository.findAllByActorId(actorId)
    if (wouldCreateCycle(categoryId, parentId, links)) {
        throw RuntimeException("Cyclic dependency detected in category tree")
    }
}
```

Алгоритм проверки циклов (`wouldCreateCycle`):
- Берём `parentId`, смотрим кто его родитель
- Поднимаемся вверх по цепочке `parentId → parent.parentId → ...`
- Если на каком-то шаге встретился `categoryId` — это цикл

#### 6. CategoryTreeService.createLink (`CategoryTreeServiceImpl.kt`)

```kotlin
override fun createLink(categoryTreeCreateModel: CategoryTreeCreateModel): CategoryTreeServiceModel {
    val createdLink = categoryTreeRepository.createLink(categoryTreeCreateModel.toCreateRow())
    return createdLink.toServiceModel()
}
```

---

## Маппинг типов

```
CategoryTypeStatusRequest (client)  →  CategoryTypeCommand (use case)  →  CategoryTypeModel (service)
EXPENSE                             →  EXPENSE                          →  EXPENSE
INCOME                              →  INCOME                           →  INCOME
SAVINGS                             →  SAVINGS                          →  SAVINGS
```

---

## Схема БД (предполагаемая)

```
┌──────────────────────┐       ┌──────────────────────────────┐
│     categories       │       │       category_tree          │
├──────────────────────┤       ├──────────────────────────────┤
│ id: UUID (PK)        │◄──┐   │ id: UUID (PK)                │
│ name: VARCHAR        │   └───│ category_id: UUID (FK)       │
│ type: VARCHAR        │       │ parent_id: UUID (FK, nullable)│
│ created_at: TIMESTAMP│       │ actor_id: UUID (FK)          │
│ updated_at: TIMESTAMP│       └──────────────────────────────┘
└──────────────────────┘
```

- `categories` — глобальная таблица всех уникальных категорий
- `category_tree` — персональные деревья пользователей (связь user → category → parent)
