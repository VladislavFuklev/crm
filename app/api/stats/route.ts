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

		// Учитываем quantity при подсчете себестоимости
		const totalCost = products.reduce(
			(sum: number, p) => sum + p.costPrice * p.quantity,
			0
		)

		// Учитываем soldQuantity при подсчете выручки
		const totalRevenue = products
			.filter(p => p.soldQuantity > 0 && p.sellingPrice)
			.reduce(
				(sum: number, p) => sum + (p.sellingPrice || 0) * p.soldQuantity,
				0
			)

		// Учитываем soldQuantity при подсчете себестоимости проданных товаров
		const totalProfit =
			totalRevenue -
			products
				.filter(p => p.soldQuantity > 0)
				.reduce((sum: number, p) => sum + p.costPrice * p.soldQuantity, 0)

		// Считаем общее количество с учетом soldQuantity
		const soldCount = products.reduce((sum, p) => sum + p.soldQuantity, 0)
		const availableCount = products.reduce(
			(sum, p) => sum + (p.quantity - p.soldQuantity),
			0
		)
		const totalCount = products.reduce((sum, p) => sum + p.quantity, 0)

		// Группировка по дням для графиков
		const dailyStats = products
			.filter(p => p.soldQuantity > 0)
			.reduce((acc: DailyStat[], product) => {
				const date = product.createdAt.toISOString().split('T')[0]
				const existing = acc.find(item => item.date === date)

				const revenue = (product.sellingPrice || 0) * product.soldQuantity
				const profit = revenue - product.costPrice * product.soldQuantity

				if (existing) {
					existing.revenue += revenue
					existing.profit += profit
					existing.cost += product.costPrice * product.soldQuantity
					existing.count += product.soldQuantity
				} else {
					acc.push({
						date,
						revenue,
						profit,
						cost: product.costPrice * product.soldQuantity,
						count: product.soldQuantity,
					})
				}
				return acc
			}, [])
			.sort((a: DailyStat, b: DailyStat) => a.date.localeCompare(b.date))

		return NextResponse.json({
			totalCost,
			totalRevenue,
			totalProfit,
			soldCount,
			availableCount,
			totalCount,
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
