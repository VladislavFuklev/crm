import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
	try {
		const products = await prisma.product.findMany({
			orderBy: { createdAt: 'desc' },
		})
		return NextResponse.json(products)
	} catch (error) {
		console.error('Error fetching products:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch products' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { name, costPrice, sellingPrice, status } = body

		if (!name || costPrice === undefined) {
			return NextResponse.json(
				{ error: 'Name and cost price are required' },
				{ status: 400 }
			)
		}

		const product = await prisma.product.create({
			data: {
				name,
				costPrice: parseFloat(costPrice),
				sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
				status: status || 'available',
			},
		})

		return NextResponse.json(product, { status: 201 })
	} catch (error) {
		console.error('Error creating product:', error)
		return NextResponse.json(
			{ error: 'Failed to create product' },
			{ status: 500 }
		)
	}
}
