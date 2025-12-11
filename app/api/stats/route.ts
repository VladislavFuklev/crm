import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type DailyStat = {
	date: string
	revenue: number
	profit: number
	cost: number
	count: number
}

export async function GET() {
	try {
		const products = await prisma.product.findMany()

		const totalCost = products.reduce((sum: number, p) => sum + p.costPrice, 0)
		const totalRevenue = products
			.filter(p => p.status === 'sold' && p.sellingPrice)
			.reduce((sum: number, p) => sum + (p.sellingPrice || 0), 0)
		const totalProfit =
			totalRevenue -
			products
				.filter(p => p.status === 'sold')
				.reduce((sum: number, p) => sum + p.costPrice, 0)

		const soldProducts = products.filter(p => p.status === 'sold')
		const availableProducts = products.filter(p => p.status === 'available')

		// Группировка по дням для графиков
		const dailyStats = products
			.filter(p => p.status === 'sold')
			.reduce((acc: DailyStat[], product) => {
				const date = product.createdAt.toISOString().split('T')[0]
				const existing = acc.find(item => item.date === date)

				const revenue = product.sellingPrice || 0
				const profit = revenue - product.costPrice

				if (existing) {
					existing.revenue += revenue
					existing.profit += profit
					existing.cost += product.costPrice
					existing.count += 1
				} else {
					acc.push({
						date,
						revenue,
						profit,
						cost: product.costPrice,
						count: 1,
					})
				}
				return acc
			}, [])
			.sort((a: DailyStat, b: DailyStat) => a.date.localeCompare(b.date))

		return NextResponse.json({
			totalCost,
			totalRevenue,
			totalProfit,
			soldCount: soldProducts.length,
			availableCount: availableProducts.length,
			totalCount: products.length,
			dailyStats,
		})
	} catch (error) {
		console.error('Error fetching stats:', error)
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error'
		console.error('Error details:', errorMessage)
		return NextResponse.json(
			{ error: 'Failed to fetch stats', details: errorMessage },
			{ status: 500 }
		)
	}
}
