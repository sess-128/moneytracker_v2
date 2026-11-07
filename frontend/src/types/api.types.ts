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
  categoryId: string
  name: string
  categoryRoot?: string | null
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

export interface TransactionPageResult {
  items: TransactionResponse[]
  nextCursor: string | null
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

// ─── Analytics ───────────────────────────────────────────────────
export interface AnalyticsFilterRequest {
  categoryIds: string[]
  startDate: string          // "yyyy-MM-dd"
  endDate?: string           // "yyyy-MM-dd"
  minAmount?: number
  maxAmount?: number
}

export interface AnalyticsFilterResponse {
  categoryName: string
  amount: string
  countOfTransactions: number
  avgInDay: number
}

// ─── Analytics: summary (/analytics/summary) ─────────────────────
export interface AnalyticsPeriodRequest {
  startDate: string          // "yyyy-MM-dd", включительно
  endDate?: string           // "yyyy-MM-dd", бэкенд сравнивает с началом дня (не включительно)
}

export interface AnalyticsSummaryValues {
  income: number
  expense: number
  savings: number
  balance: number
}

export interface AnalyticsMonthSummary {
  month: number              // 1..12
  summary: AnalyticsSummaryValues
}

export interface AnalyticsYearSummary {
  year: number
  months: AnalyticsMonthSummary[]
  summary: AnalyticsSummaryValues
}

export interface AnalyticsSummaryResponse {
  years: AnalyticsYearSummary[]
}

// ─── Analytics: typed summary (/analytics/summary/by-type) ──────
export interface AnalyticsTypedSummaryRequest extends AnalyticsPeriodRequest {
  type: CategoryType
  minAmount?: number
}

export interface AnalyticsTypedSummary {
  sum: number
  percentage: number
  maxForMonth: number
  average: number
}

export interface AnalyticsTransactionItem {
  id: string
  categoryId: string
  categoryName: string
  amount: number
  description: string | null
  transactionDate: string    // ISO datetime
}

export interface AnalyticsTransactionGroup {
  categoryId: string
  categoryName: string
  summary: AnalyticsTypedSummary       // сумма по всему поддереву
  items: AnalyticsTransactionItem[]    // операции только этой категории
  childCategories: AnalyticsTransactionGroup[]
}

export interface AnalyticsTypedSummaryResponse {
  summary: AnalyticsTypedSummary
  transactions: AnalyticsTransactionGroup[]
}
