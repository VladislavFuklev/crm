'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ProductForm } from './ProductForm'

type Product = {
	id: string
	name: string
	costPrice: number
	sellingPrice: number | null
	status: string
	createdAt: string
}

type ProductTableProps = {
	products: Product[]
	onUpdate: () => void
}

export function ProductTable({ products, onUpdate }: ProductTableProps) {
	const [filter, setFilter] = useState<string>('all')
	const [editProduct, setEditProduct] = useState<Product | undefined>()
	const [showForm, setShowForm] = useState(false)
	const [showAddForm, setShowAddForm] = useState(false)

	const filteredProducts = products.filter(p => {
		if (filter === 'all') return true
		return p.status === filter
	})

	const formatCurrency = (amount: number | null) => {
		if (amount === null) return '-'
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'UAH',
		}).format(amount)
	}

	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return '-'
		return new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(new Date(dateStr))
	}

	const getProfit = (product: Product) => {
		if (product.status !== 'sold' || !product.sellingPrice) return null
		return product.sellingPrice - product.costPrice
	}

	const handleEdit = (product: Product) => {
		setEditProduct(product)
		setShowForm(true)
	}

	const handleDelete = async (id: string) => {
		if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

		try {
			const response = await fetch(`/api/products/${id}`, {
				method: 'DELETE',
			})

			if (!response.ok) throw new Error('Failed to delete')

			onUpdate()
		} catch (error) {
			console.error('Error deleting product:', error)
			alert('Ошибка при удалении товара')
		}
	}

	const handleFormClose = () => {
		setShowForm(false)
		setShowAddForm(false)
		setEditProduct(undefined)
	}

	return (
		<Card>
			<CardHeader className='p-4 sm:p-6'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<CardTitle className='text-lg sm:text-xl'>
							Управление товарами
						</CardTitle>
						<CardDescription className='text-xs sm:text-sm mt-1'>
							Всего: {products.length} • Показано: {filteredProducts.length}
						</CardDescription>
					</div>
					<div className='flex flex-col sm:flex-row gap-2'>
						<Select value={filter} onValueChange={setFilter}>
							<SelectTrigger className='w-full sm:w-[180px]'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Все товары</SelectItem>
								<SelectItem value='available'>В наличии</SelectItem>
								<SelectItem value='sold'>Проданные</SelectItem>
							</SelectContent>
						</Select>
						<Button
							onClick={() => setShowAddForm(true)}
							className='w-full sm:w-auto'
						>
							<Plus className='mr-2 h-4 w-4' />
							<span className='sm:inline'>Добавить</span>
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className='p-0 sm:p-6'>
				<div className='rounded-md border overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='min-w-[120px]'>Название</TableHead>
								<TableHead className='hidden sm:table-cell'>
									Себестоимость
								</TableHead>
								<TableHead className='hidden md:table-cell'>
									Цена продажи
								</TableHead>
								<TableHead className='hidden lg:table-cell'>Прибыль</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead className='hidden xl:table-cell'>
									Дата добавления
								</TableHead>
								<TableHead className='text-right'>Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProducts.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className='text-center text-muted-foreground py-8'
									>
										Нет товаров для отображения
									</TableCell>
								</TableRow>
							) : (
								filteredProducts.map(product => {
									const profit = getProfit(product)
									return (
										<TableRow key={product.id}>
											<TableCell className='font-medium text-xs sm:text-sm'>
												{product.name}
											</TableCell>
											<TableCell className='hidden sm:table-cell text-xs sm:text-sm'>
												{formatCurrency(product.costPrice)}
											</TableCell>
											<TableCell className='hidden md:table-cell text-xs sm:text-sm'>
												{formatCurrency(product.sellingPrice)}
											</TableCell>
											<TableCell className='hidden lg:table-cell text-xs sm:text-sm'>
												{profit !== null ? (
													<span
														className={
															profit >= 0 ? 'text-green-600' : 'text-red-600'
														}
													>
														{formatCurrency(profit)}
													</span>
												) : (
													'-'
												)}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium ${
														product.status === 'sold'
															? 'bg-green-100 text-green-800'
															: 'bg-blue-100 text-blue-800'
													}`}
												>
													{product.status === 'sold' ? 'Продано' : 'Наличие'}
												</span>
											</TableCell>
											<TableCell className='hidden xl:table-cell text-xs'>
												{formatDate(product.createdAt)}
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end gap-1'>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8'
														onClick={() => handleEdit(product)}
													>
														<Edit className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
													</Button>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8'
														onClick={() => handleDelete(product.id)}
													>
														<Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600' />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									)
								})
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>

			<ProductForm
				product={editProduct}
				open={showForm || showAddForm}
				onOpenChange={handleFormClose}
				onSave={() => {
					onUpdate()
					handleFormClose()
				}}
			/>
		</Card>
	)
}
