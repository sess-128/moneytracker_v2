export type CategoryType = 'EXPENSE' | 'INCOME' | 'SAVINGS'

// ─── Auth ────────────────────────────────────────────────────────
export interface UserLoginRequest {
  username: string
  password: string
}

export interface UserRegistrationRequest {
  username: string
  password: string
  email: string
}

export interface UserTokenResponse {
  token: string
}

export interface UserInfoResponse {
  id: string
  login: string
}

// ─── Categories ──────────────────────────────────────────────────
export interface CategoryResponse {
  categoryId: string
  parentId: string | null
  linkId?: string
  name: string
  type: CategoryType
}

export interface CategoryTreeResponse {
  categoryId: string
  name: string
  type: CategoryType
  childCategories: CategoryTreeResponse[]
}

export interface CategoryCreateRequest {
  name: string
  type: CategoryType
  parentId?: string | null
}

export interface CategoryUpdateRequest {
  oldCategoryId: string
  name: string
}

// ─── Transactions ────────────────────────────────────────────────
export interface TransactionCreateRequest {
  categoryId: string
  categoryName: string
  amount: number
  description?: string | null
  transactionDate?: string | null  // ISO datetime: "2026-05-22T00:00:00"
}

export interface TransactionUpdateRequest {
  id: string
  transactionDate: string          // ISO datetime: "2026-05-22T00:00:00"
}

export interface TransactionResponse {
  id: string
  categoryId: string
  categoryName: string
  type: CategoryType
  amount: number
  description?: string | null
  transactionDate?: string | null
}

export interface TransactionFilterRequest {
  startDate: string
  endDate: string
  parentCategoryIds: string[]
  categoryIds: string[]
  minAmount: number
  maxAmount: number
  description: string
  type?: CategoryType | null
}
