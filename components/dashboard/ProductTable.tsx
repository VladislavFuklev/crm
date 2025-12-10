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
	soldAt: string | null
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
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle>Управление товарами</CardTitle>
						<CardDescription>
							Всего товаров: {products.length} • Показано:{' '}
							{filteredProducts.length}
						</CardDescription>
					</div>
					<div className='flex gap-2'>
						<Select value={filter} onValueChange={setFilter}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Все товары</SelectItem>
								<SelectItem value='available'>В наличии</SelectItem>
								<SelectItem value='sold'>Проданные</SelectItem>
							</SelectContent>
						</Select>
						<Button onClick={() => setShowAddForm(true)}>
							<Plus className='mr-2 h-4 w-4' />
							Добавить товар
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Название</TableHead>
								<TableHead>Себестоимость</TableHead>
								<TableHead>Цена продажи</TableHead>
								<TableHead>Прибыль</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead>Дата добавления</TableHead>
								<TableHead>Дата продажи</TableHead>
								<TableHead className='text-right'>Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProducts.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className='text-center text-muted-foreground'
									>
										Нет товаров для отображения
									</TableCell>
								</TableRow>
							) : (
								filteredProducts.map(product => {
									const profit = getProfit(product)
									return (
										<TableRow key={product.id}>
											<TableCell className='font-medium'>
												{product.name}
											</TableCell>
											<TableCell>{formatCurrency(product.costPrice)}</TableCell>
											<TableCell>
												{formatCurrency(product.sellingPrice)}
											</TableCell>
											<TableCell>
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
													className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
														product.status === 'sold'
															? 'bg-green-100 text-green-800'
															: 'bg-blue-100 text-blue-800'
													}`}
												>
													{product.status === 'sold' ? 'Продано' : 'В наличии'}
												</span>
											</TableCell>
											<TableCell>{formatDate(product.createdAt)}</TableCell>
											<TableCell>{formatDate(product.soldAt)}</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end gap-2'>
													<Button
														variant='ghost'
														size='icon'
														onClick={() => handleEdit(product)}
													>
														<Edit className='h-4 w-4' />
													</Button>
													<Button
														variant='ghost'
														size='icon'
														onClick={() => handleDelete(product.id)}
													>
														<Trash2 className='h-4 w-4 text-red-600' />
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
