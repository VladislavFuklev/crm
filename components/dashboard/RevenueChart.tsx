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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

type DailyStat = {
	date: string
	revenue: number
	profit: number
	cost: number
	count: number
}

type RevenueChartProps = {
	data: DailyStat[]
}

const chartConfig = {
	revenue: {
		label: 'Доход',
		color: 'hsl(var(--chart-1))',
	},
	cost: {
		label: 'Расход',
		color: 'hsl(var(--chart-2))',
	},
}

export function RevenueChart({ data }: RevenueChartProps) {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Динамика доходов и расходов</CardTitle>
				<CardDescription>
					Сравнение доходов от продаж и расходов по дням
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='h-[300px] w-full'>
					<AreaChart data={chartData}>
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
						<Area
							type='monotone'
							dataKey='revenue'
							stackId='1'
							stroke='hsl(var(--chart-1))'
							fill='hsl(var(--chart-1))'
							fillOpacity={0.6}
						/>
						<Area
							type='monotone'
							dataKey='cost'
							stackId='2'
							stroke='hsl(var(--chart-2))'
							fill='hsl(var(--chart-2))'
							fillOpacity={0.6}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
