export type TransactionType = 'EXPENSE' | 'INCOME' | 'SAVINGS'

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

export interface TransactionRequest {
  categoryName: string
  amount: number
  description: string
  startDate: string
  endDate: string
}

export interface TransactionUpdateRequest {
  id: string
  createdAt: string
}

export interface TransactionResponse {
  id: string
  categoryName: string
  userName: string
  amount: number
  description: string
  startDate: string
  endDate: string
}

export interface TransactionFilterRequest {
  startDate: string
  endDate: string
  parentCategoryIds: number[]
  categoryIds: number[]
  minAmount: number
  maxAmount: number
  description: string
  type?: TransactionType | null
}

export interface CategoryResponse {
  id: string
  name: string
  type: TransactionType
  parentId?: string | null
}

export interface CategoryCreateRequest {
  name: string
  type: TransactionType
  parentId?: string | null
}

export interface CategoryUpdateRequest {
  name: string
}
