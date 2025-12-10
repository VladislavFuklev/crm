// Типы для приложения

export type Product = {
	id: string
	name: string
	costPrice: number
	sellingPrice: number | null
	status: 'available' | 'sold'
	createdAt: string
	soldAt: string | null
}

export type DailyStat = {
	date: string
	revenue: number
	profit: number
	cost: number
	count: number
}

export type Stats = {
	totalCost: number
	totalRevenue: number
	totalProfit: number
	soldCount: number
	availableCount: number
	totalCount: number
	dailyStats: DailyStat[]
}
