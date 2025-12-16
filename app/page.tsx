'use client'

import { ProductTable } from '@/components/dashboard/ProductTable'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { useEffect, useState } from 'react'

type Product = {
	id: string
	name: string
	costPrice: number
	sellingPrice: number | null
	status: string
	quantity: number
	soldQuantity: number
	createdAt: string
}

type Stats = {
	totalCost: number
	totalRevenue: number
	totalProfit: number
	soldCount: number
	availableCount: number
	totalCount: number
	dailyStats: Array<{
		date: string
		revenue: number
		profit: number
		cost: number
		count: number
	}>
}

export default function Home() {
	const [products, setProducts] = useState<Product[]>([])
	const [stats, setStats] = useState<Stats | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchData = async () => {
		try {
			const [productsRes, statsRes] = await Promise.all([
				fetch('/api/products'),
				fetch('/api/stats'),
			])

			const productsData = await productsRes.json()
			const statsData = await statsRes.json()

			setProducts(productsData)
			setStats(statsData)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-lg'>Загрузка...</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background'>
			<div className='container mx-auto py-4 px-3 sm:py-10 sm:px-4'>
				<header className='mb-6 sm:mb-8'>
					<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight'>
						Mini CRM
					</h1>
					<p className='text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base'>
						Учет товаров и продаж
					</p>
				</header>

				<div className='space-y-8'>
					{stats && (
						<StatsCards
							totalCost={stats.totalCost}
							totalRevenue={stats.totalRevenue}
							totalProfit={stats.totalProfit}
							soldCount={stats.soldCount}
							availableCount={stats.availableCount}
						/>
					)}

					<ProductTable products={products} onUpdate={fetchData} />
				</div>
			</div>
		</div>
	)
}
