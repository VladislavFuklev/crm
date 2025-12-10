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
		<div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6'>
					<CardTitle className='text-xs sm:text-sm font-medium'>
						Общие расходы
					</CardTitle>
					<DollarSign className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
					<div className='text-lg sm:text-2xl font-bold'>
						{formatCurrency(totalCost)}
					</div>
					<p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>
						Себестоимость всех товаров
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6'>
					<CardTitle className='text-xs sm:text-sm font-medium'>
						Общий доход
					</CardTitle>
					<TrendingUp className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
					<div className='text-lg sm:text-2xl font-bold text-green-600'>
						{formatCurrency(totalRevenue)}
					</div>
					<p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>
						Продано товаров: {soldCount}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6'>
					<CardTitle className='text-xs sm:text-sm font-medium'>
						Прибыль
					</CardTitle>
					<TrendingUp className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
					<div
						className={`text-lg sm:text-2xl font-bold ${
							totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
						}`}
					>
						{formatCurrency(totalProfit)}
					</div>
					<p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>
						Маржа: {profitMargin}%
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6'>
					<CardTitle className='text-xs sm:text-sm font-medium'>
						Товары в наличии
					</CardTitle>
					<Package className='h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
					<div className='text-lg sm:text-2xl font-bold'>{availableCount}</div>
					<p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>
						<ShoppingCart className='inline h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1' />
						Доступно для продажи
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
