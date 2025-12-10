'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

type DailyStat = {
	date: string
	revenue: number
	profit: number
	cost: number
	count: number
}

type ProfitChartProps = {
	data: DailyStat[]
}

const chartConfig = {
	profit: {
		label: 'Прибыль',
		color: 'hsl(var(--chart-3))',
	},
}

export function ProfitChart({ data }: ProfitChartProps) {
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'UAH',
			minimumFractionDigits: 0,
		}).format(value)
	}

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr)
		return new Intl.DateTimeFormat('ru-RU', {
			month: 'short',
			day: 'numeric',
		}).format(date)
	}

	const chartData = data.map(item => ({
		...item,
		dateFormatted: formatDate(item.date),
	}))

	const totalProfit = data.reduce((sum, item) => sum + item.profit, 0)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Прибыль по дням</CardTitle>
				<CardDescription>
					Чистая прибыль за каждый день продаж • Всего:{' '}
					{formatCurrency(totalProfit)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='h-[300px] w-full'>
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='dateFormatted'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis
							tickFormatter={formatCurrency}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar
							dataKey='profit'
							fill='hsl(var(--chart-3))'
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
