export type CategoryType = 'EXPENSE' | 'INCOME'

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
  id: string
  name: string
  type: CategoryType
  parentId?: string | null
}

export interface CategoryCreateRequest {
  name: string
  type: CategoryType
  parentId?: string | null
}

export interface CategoryUpdateRequest {
  name: string
}

// ─── Transactions ────────────────────────────────────────────────
export interface TransactionCreateRequest {
  categoryId: string
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
