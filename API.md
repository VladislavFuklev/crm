# API Documentation

## Endpoints

### Products

#### GET /api/products

Получить список всех товаров

**Response:**

```json
[
	{
		"id": "clx1234567890",
		"name": "iPhone 15 Pro",
		"costPrice": 30000,
		"sellingPrice": 35000,
		"status": "sold",
		"createdAt": "2025-12-10T10:00:00.000Z",
		"soldAt": "2025-12-10T15:30:00.000Z"
	}
]
```

#### POST /api/products

Добавить новый товар

**Request Body:**

```json
{
	"name": "iPhone 15 Pro",
	"costPrice": 30000,
	"sellingPrice": null,
	"status": "available"
}
```

**Response:**

```json
{
	"id": "clx1234567890",
	"name": "iPhone 15 Pro",
	"costPrice": 30000,
	"sellingPrice": null,
	"status": "available",
	"createdAt": "2025-12-10T10:00:00.000Z",
	"soldAt": null
}
```

#### PATCH /api/products/[id]

Обновить товар

**Request Body:**

```json
{
	"name": "iPhone 15 Pro Max",
	"sellingPrice": 35000,
	"status": "sold",
	"soldAt": "2025-12-10T15:30:00.000Z"
}
```

**Response:**

```json
{
	"id": "clx1234567890",
	"name": "iPhone 15 Pro Max",
	"costPrice": 30000,
	"sellingPrice": 35000,
	"status": "sold",
	"createdAt": "2025-12-10T10:00:00.000Z",
	"soldAt": "2025-12-10T15:30:00.000Z"
}
```

#### DELETE /api/products/[id]

Удалить товар

**Response:**

```json
{
	"success": true
}
```

### Statistics

#### GET /api/stats

Получить статистику по всем товарам

**Response:**

```json
{
	"totalCost": 100000,
	"totalRevenue": 120000,
	"totalProfit": 20000,
	"soldCount": 5,
	"availableCount": 3,
	"totalCount": 8,
	"dailyStats": [
		{
			"date": "2025-12-10",
			"revenue": 35000,
			"profit": 5000,
			"cost": 30000,
			"count": 1
		}
	]
}
```

## Examples

### cURL

```bash
# Получить все товары
curl http://localhost:3000/api/products

# Добавить товар
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone 15","costPrice":30000,"status":"available"}'

# Обновить товар
curl -X PATCH http://localhost:3000/api/products/clx123 \
  -H "Content-Type: application/json" \
  -d '{"sellingPrice":35000,"status":"sold"}'

# Удалить товар
curl -X DELETE http://localhost:3000/api/products/clx123

# Получить статистику
curl http://localhost:3000/api/stats
```

### JavaScript/TypeScript

```typescript
// Получить все товары
const products = await fetch('/api/products').then(r => r.json())

// Добавить товар
const newProduct = await fetch('/api/products', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		name: 'iPhone 15',
		costPrice: 30000,
		status: 'available',
	}),
}).then(r => r.json())

// Обновить товар
const updated = await fetch('/api/products/clx123', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		sellingPrice: 35000,
		status: 'sold',
		soldAt: new Date().toISOString(),
	}),
}).then(r => r.json())

// Удалить товар
await fetch('/api/products/clx123', { method: 'DELETE' })

// Получить статистику
const stats = await fetch('/api/stats').then(r => r.json())
```
