import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const body = await request.json()
		const { name, costPrice, sellingPrice, status } = body

		const product = await prisma.product.update({
			where: { id },
			data: {
				...(name && { name }),
				...(costPrice !== undefined && { costPrice: parseFloat(costPrice) }),
				...(sellingPrice !== undefined && {
					sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
				}),
				...(status && { status }),
			},
		})

		return NextResponse.json(product)
	} catch (error) {
		console.error('Error updating product:', error)
		return NextResponse.json(
			{ error: 'Failed to update product' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		await prisma.product.delete({
			where: { id },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting product:', error)
		return NextResponse.json(
			{ error: 'Failed to delete product' },
			{ status: 500 }
		)
	}
}
