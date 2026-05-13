import { describe, it, expect } from 'vitest'
import { formatPrice, getDiscount, getBestPrice, getAllProducts, getProductBySlug, getProductsByCategory, sampleProducts } from '@/lib/utils'
import type { Price } from '@/types'

describe('formatPrice', () => {
  it('formats price in INR', () => {
    expect(formatPrice(1299)).toContain('1,299')
  })

  it('formats large numbers with commas', () => {
    expect(formatPrice(79900)).toContain('79,900')
  })
})

describe('getDiscount', () => {
  it('calculates discount percentage', () => {
    expect(getDiscount(2000, 1500)).toBe(25)
  })

  it('returns 0 for same price', () => {
    expect(getDiscount(1000, 1000)).toBe(0)
  })

  it('rounds to nearest integer', () => {
    expect(getDiscount(1000, 334)).toBe(67)
  })
})

describe('getBestPrice', () => {
  const prices: Price[] = [
    { id: '1', product_id: 'p1', platform: 'amazon', price: 500, original_price: 600, discount_percent: 17, affiliate_link: '#', in_stock: true, last_updated: '' },
    { id: '2', product_id: 'p1', platform: 'flipkart', price: 450, original_price: 600, discount_percent: 25, affiliate_link: '#', in_stock: true, last_updated: '' },
    { id: '3', product_id: 'p1', platform: 'meesho', price: 400, original_price: 600, discount_percent: 33, affiliate_link: '#', in_stock: false, last_updated: '' },
  ]

  it('returns cheapest in-stock price', () => {
    expect(getBestPrice(prices)?.price).toBe(450)
  })

  it('returns undefined when no prices in stock', () => {
    const outOfStock = prices.map(p => ({ ...p, in_stock: false }))
    expect(getBestPrice(outOfStock)).toBeUndefined()
  })

  it('returns undefined for empty array', () => {
    expect(getBestPrice([])).toBeUndefined()
  })
})

describe('getAllProducts', () => {
  it('returns all 14 sample products', () => {
    const products = getAllProducts()
    expect(products.length).toBe(14)
  })

  it('each product has required fields', () => {
    const products = getAllProducts()
    products.forEach(p => {
      expect(p.name).toBeTruthy()
      expect(p.slug).toBeTruthy()
      expect(p.category).toBeTruthy()
      expect(p.prices).toBeTruthy()
      expect(typeof p.rating).toBe('number')
      expect(typeof p.review_count).toBe('number')
    })
  })
})

describe('getProductBySlug', () => {
  it('finds a product by slug', () => {
    const product = getProductBySlug('boat-airdopes-141')
    expect(product).toBeTruthy()
    expect(product?.name).toBe('boAt Airdopes 141')
  })

  it('returns undefined for unknown slug', () => {
    expect(getProductBySlug('nonexistent')).toBeUndefined()
  })
})

describe('getProductsByCategory', () => {
  it('filters products by category', () => {
    const mobiles = getProductsByCategory('mobiles')
    expect(mobiles.length).toBeGreaterThanOrEqual(1)
    mobiles.forEach(p => expect(p.category).toBe('mobiles'))
  })

  it('returns empty array for unknown category', () => {
    expect(getProductsByCategory('unknown')).toEqual([])
  })
})
