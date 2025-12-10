'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react'

type StatsCardsProps = {
	totalCost: number
	totalRevenue: number
	totalProfit: number
	soldCount: number
	availableCount: number
}

export function StatsCards({
	totalCost,
	totalRevenue,
	totalProfit,
	soldCount,
	availableCount,
}: StatsCardsProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'UAH',
		}).format(amount)
	}

	const profitMargin =
		totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Общие расходы</CardTitle>
					<DollarSign className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{formatCurrency(totalCost)}</div>
					<p className='text-xs text-muted-foreground'>
						Себестоимость всех товаров
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Общий доход</CardTitle>
					<TrendingUp className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-green-600'>
						{formatCurrency(totalRevenue)}
					</div>
					<p className='text-xs text-muted-foreground'>
						Продано товаров: {soldCount}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Прибыль</CardTitle>
					<TrendingUp className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div
						className={`text-2xl font-bold ${
							totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
						}`}
					>
						{formatCurrency(totalProfit)}
					</div>
					<p className='text-xs text-muted-foreground'>
						Маржа: {profitMargin}%
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Товары в наличии
					</CardTitle>
					<Package className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{availableCount}</div>
					<p className='text-xs text-muted-foreground'>
						<ShoppingCart className='inline h-3 w-3 mr-1' />
						Доступно для продажи
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
