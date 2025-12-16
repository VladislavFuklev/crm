'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

type ProductFormProps = {
	product?: Product
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: () => void
}

export function ProductForm({
	product,
	open,
	onOpenChange,
	onSave,
}: ProductFormProps) {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: product?.name || '',
		costPrice: product?.costPrice?.toString() || '',
		sellingPrice: product?.sellingPrice?.toString() || '',
		quantity: product?.quantity?.toString() || '1',
		soldQuantity: product?.soldQuantity?.toString() || '0',
	})

	// Обновление формы при изменении product
	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name || '',
				costPrice: product.costPrice?.toString() || '',
				sellingPrice: product.sellingPrice?.toString() || '',
				quantity: product.quantity?.toString() || '1',
				soldQuantity: product.soldQuantity?.toString() || '0',
			})
		} else {
			setFormData({
				name: '',
				costPrice: '',
				sellingPrice: '',
				quantity: '1',
				soldQuantity: '0',
			})
		}
	}, [product, open])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const url = product ? `/api/products/${product.id}` : '/api/products'
			const method = product ? 'PATCH' : 'POST'

			const soldQty = parseInt(formData.soldQuantity)
			const totalQty = parseInt(formData.quantity)

			// Автоматический расчет статуса
			let status = 'available'
			if (soldQty > 0 && soldQty < totalQty) {
				status = 'partially_sold'
			} else if (soldQty === totalQty && soldQty > 0) {
				status = 'sold'
			}

			const payload = {
				name: formData.name,
				costPrice: parseFloat(formData.costPrice),
				sellingPrice: formData.sellingPrice
					? parseFloat(formData.sellingPrice)
					: null,
				status,
				quantity: totalQty,
				soldQuantity: soldQty,
			}

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			if (!response.ok) throw new Error('Failed to save product')

			onSave()
			onOpenChange(false)

			// Сброс формы
			if (!product) {
				setFormData({
					name: '',
					costPrice: '',
					sellingPrice: '',
					quantity: '1',
					soldQuantity: '0',
				})
			}
		} catch (error) {
			console.error('Error saving product:', error)
			alert('Ошибка при сохранении товара')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className='text-lg sm:text-xl'>
							{product ? 'Редактировать товар' : 'Добавить товар'}
						</DialogTitle>
						<DialogDescription className='text-xs sm:text-sm'>
							{product
								? 'Обновите информацию о товаре'
								: 'Введите данные нового товара для учета'}
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-3 sm:gap-4 py-3 sm:py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Название товара *</Label>
							<Input
								id='name'
								value={formData.name}
								onChange={e =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder='Например: iPhone 15 Pro'
								required
							/>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='costPrice'>Себестоимость (UAH) *</Label>
							<Input
								id='costPrice'
								type='number'
								step='0.01'
								value={formData.costPrice}
								onChange={e =>
									setFormData({ ...formData, costPrice: e.target.value })
								}
								placeholder='0.00'
								required
							/>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='quantity'>Общее количество *</Label>
							<Input
								id='quantity'
								type='number'
								min='1'
								step='1'
								value={formData.quantity}
								onChange={e =>
									setFormData({ ...formData, quantity: e.target.value })
								}
								placeholder='1'
								required
							/>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='soldQuantity'>Продано (шт)</Label>
							<Input
								id='soldQuantity'
								type='number'
								min='0'
								max={formData.quantity}
								step='1'
								value={formData.soldQuantity}
								onChange={e => {
									const soldQty = e.target.value
									setFormData({ ...formData, soldQuantity: soldQty })
								}}
								placeholder='0'
							/>
							<p className='text-xs text-muted-foreground'>
								Доступно:{' '}
								{parseInt(formData.quantity || '0') -
									parseInt(formData.soldQuantity || '0')}{' '}
								шт
							</p>
						</div>

						{parseInt(formData.soldQuantity) > 0 && (
							<div className='grid gap-2'>
								<Label htmlFor='sellingPrice'>
									Цена продажи за единицу (UAH) *
								</Label>
								<Input
									id='sellingPrice'
									type='number'
									step='0.01'
									value={formData.sellingPrice}
									onChange={e =>
										setFormData({ ...formData, sellingPrice: e.target.value })
									}
									placeholder='0.00'
									required={parseInt(formData.soldQuantity) > 0}
								/>
							</div>
						)}
					</div>
					<DialogFooter className='flex-col sm:flex-row gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
							className='w-full sm:w-auto'
						>
							Отмена
						</Button>
						<Button
							type='submit'
							disabled={loading}
							className='w-full sm:w-auto'
						>
							{loading ? 'Сохранение...' : 'Сохранить'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
