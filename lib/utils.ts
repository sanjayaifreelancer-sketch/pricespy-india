import { Platform, platformConfig, Price, SampleProduct, Product } from '@/types'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function getDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function getBestPrice(prices: Price[]): Price | undefined {
  const inStock = prices.filter(p => p.in_stock)
  if (inStock.length === 0) return undefined
  return inStock.reduce((min, p) => (p.price < min.price ? p : min))
}

export function handleBuyClick(affiliateLink: string, platform: string, productId: string) {
  console.log(`Click: ${platform} - ${productId}`)
  window.open(affiliateLink, '_blank', 'noopener,noreferrer')
}

export function generatePriceHistory(basePrice: number, days: number = 90) {
  const history: { date: string; price: number; platform: string }[] = []
  let price = basePrice
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const variation = Math.random() * 0.15 - 0.05
    price = Math.round(price * (1 + variation))
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, Math.round(basePrice * 0.6)),
      platform: 'amazon',
    })
  }
  return history
}

export const platformLogo = (platform: Platform) => {
  const cfg = platformConfig[platform]
  return { letter: cfg.label[0], color: cfg.color, bg: cfg.bg, label: cfg.label }
}

export const sampleProducts: SampleProduct[] = [
  {
    name: "boAt Airdopes 141",
    slug: "boat-airdopes-141",
    category: "earbuds",
    brand: "boAt",
    description: "True wireless earbuds with 42 hours total playback, 8mm drivers, and IPX4 water resistance",
    rating: 4.1,
    review_count: 28500,
    specs: { "Battery Life": "Up to 42 Hours", "Low Latency": "80ms BEAST Mode", "Water Resistance": "IPX4 Rated", "Drivers": "8mm Dynamic" },
    prices: {
      amazon:   { price: 1299, original: 1999, link: "#amazon-affiliate-link" },
      flipkart: { price: 1199, original: 1999, link: "#flipkart-affiliate-link" },
      meesho:   { price: 1099, original: 1999, link: "#meesho-affiliate-link" },
    },
  },
  {
    name: "iPhone 15 (128GB, Black)",
    slug: "iphone-15-128gb-black",
    category: "mobiles",
    brand: "Apple",
    description: "Apple iPhone 15 with A16 Bionic chip and 48MP camera system",
    rating: 4.5,
    review_count: 89200,
    specs: { "Display": "6.1-inch OLED", "Processor": "A16 Bionic", "Camera": "48MP + 12MP", "Battery": "3349mAh" },
    prices: {
      amazon:   { price: 79900, original: 84900, link: "#amazon-affiliate-link" },
      flipkart: { price: 78500, original: 84900, link: "#flipkart-affiliate-link" },
      croma:    { price: 82000, original: 84900, link: "#croma-affiliate-link" },
    },
  },
  {
    name: "Samsung 43 inch 4K Smart TV",
    slug: "samsung-43-4k-smart-tv",
    category: "electronics",
    brand: "Samsung",
    description: "43 inch 4K UHD Smart TV with Tizen OS and HDR support",
    rating: 4.3,
    review_count: 42100,
    specs: { "Screen Size": "43 inches", "Resolution": "4K UHD (3840x2160)", "OS": "Tizen", "HDMI": "3 Ports" },
    prices: {
      amazon:   { price: 32990, original: 42900, link: "#amazon-affiliate-link" },
      flipkart: { price: 31490, original: 42900, link: "#flipkart-affiliate-link" },
      croma:    { price: 34990, original: 42900, link: "#croma-affiliate-link" },
    },
  },
  {
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    category: "fashion",
    brand: "Nike",
    description: "Nike Air Max 270 with large Air unit for all-day comfort",
    rating: 4.4,
    review_count: 56700,
    specs: { "Type": "Casual Sneakers", "Sole": "Rubber", "Closure": "Lace-up", "Country": "Imported" },
    prices: {
      amazon:   { price: 8995, original: 12995, link: "#amazon-affiliate-link" },
      flipkart: { price: 9499, original: 12995, link: "#flipkart-affiliate-link" },
      myntra:   { price: 8495, original: 12995, link: "#myntra-affiliate-link" },
    },
  },
  {
    name: "Prestige Iris 750W Mixer Grinder",
    slug: "prestige-iris-750w-mixer-grinder",
    category: "home-kitchen",
    brand: "Prestige",
    description: "750W powerful motor with 3 stainless steel jars and 1 juice jar",
    rating: 4.2,
    review_count: 18300,
    specs: { "Power": "750W", "Jars": "4 (3 SS + 1 Juice)", "Speed": "3 Speeds", "Warranty": "2 Years" },
    prices: {
      amazon:   { price: 2499, original: 4500, link: "#amazon-affiliate-link" },
      flipkart: { price: 2299, original: 4500, link: "#flipkart-affiliate-link" },
      meesho:   { price: 1999, original: 4500, link: "#meesho-affiliate-link" },
    },
  },
  {
    name: "MacBook Air M3 (16GB/256GB)",
    slug: "macbook-air-m3-16-256",
    category: "laptops",
    brand: "Apple",
    description: "Apple MacBook Air with M3 chip, 16GB unified memory, and 256GB SSD",
    rating: 4.7,
    review_count: 34100,
    specs: { "Chip": "Apple M3", "Memory": "16GB Unified", "Storage": "256GB SSD", "Display": "13.6-inch Liquid Retina", "Battery": "Up to 18 Hours" },
    prices: {
      amazon:   { price: 99900, original: 114900, link: "#amazon-affiliate-link" },
      flipkart: { price: 97900, original: 114900, link: "#flipkart-affiliate-link" },
      croma:    { price: 102900, original: 114900, link: "#croma-affiliate-link" },
    },
  },
  {
    name: "ASUS Vivobook 15",
    slug: "asus-vivobook-15",
    category: "laptops",
    brand: "ASUS",
    description: "ASUS Vivobook 15 with Intel i5, 16GB RAM, and 512GB SSD for everyday productivity",
    rating: 4.0,
    review_count: 22100,
    specs: { "Processor": "Intel Core i5-1335U", "RAM": "16GB DDR4", "Storage": "512GB SSD", "Display": "15.6-inch FHD" },
    prices: {
      amazon:   { price: 44990, original: 52990, link: "#amazon-affiliate-link" },
      flipkart: { price: 42990, original: 52990, link: "#flipkart-affiliate-link" },
    },
  },
  {
    name: "OnePlus Nord CE 4",
    slug: "oneplus-nord-ce-4",
    category: "mobiles",
    brand: "OnePlus",
    description: "OnePlus Nord CE 4 with Snapdragon 7 Gen 3 and 100W fast charging",
    rating: 4.1,
    review_count: 15200,
    specs: { "Processor": "Snapdragon 7 Gen 3", "RAM": "8GB", "Storage": "128GB", "Battery": "5500mAh", "Charging": "100W SUPERVOOC" },
    prices: {
      amazon:   { price: 23999, original: 26999, link: "#amazon-affiliate-link" },
      flipkart: { price: 23499, original: 26999, link: "#flipkart-affiliate-link" },
    },
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    category: "mobiles",
    brand: "Samsung",
    description: "Samsung Galaxy S24 Ultra with S Pen, 200MP camera, and Galaxy AI",
    rating: 4.6,
    review_count: 72300,
    specs: { "Display": "6.8-inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "Camera": "200MP + 50MP + 12MP + 10MP", "Battery": "5000mAh", "S Pen": "Built-in" },
    prices: {
      amazon:   { price: 109999, original: 129999, link: "#amazon-affiliate-link" },
      flipkart: { price: 107999, original: 129999, link: "#flipkart-affiliate-link" },
      croma:    { price: 112999, original: 129999, link: "#croma-affiliate-link" },
    },
  },
  {
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    category: "earbuds",
    brand: "Sony",
    description: "Industry-leading noise canceling wireless headphones with 30-hour battery life",
    rating: 4.7,
    review_count: 45100,
    specs: { "Driver": "30mm", "Frequency Response": "4Hz-40,000Hz", "Battery": "30 Hours", "Noise Canceling": "Auto NC Optimizer", "Codec": "LDAC" },
    prices: {
      amazon:   { price: 24990, original: 29990, link: "#amazon-affiliate-link" },
      flipkart: { price: 23990, original: 29990, link: "#flipkart-affiliate-link" },
      croma:    { price: 25990, original: 29990, link: "#croma-affiliate-link" },
    },
  },
  {
    name: "Noise ColorFit Pro 5",
    slug: "noise-colorfit-pro-5",
    category: "accessories",
    brand: "Noise",
    description: "Noise ColorFit Pro 5 smartwatch with 1.96 AMOLED display and Bluetooth calling",
    rating: 3.9,
    review_count: 38700,
    specs: { "Display": "1.96-inch AMOLED", "Battery": "Up to 7 Days", "Water Resistance": "IP68", "Sensors": "Heart Rate, SpO2, Sleep" },
    prices: {
      amazon:   { price: 2999, original: 5999, link: "#amazon-affiliate-link" },
      flipkart: { price: 2799, original: 5999, link: "#flipkart-affiliate-link" },
      meesho:   { price: 2599, original: 5999, link: "#meesho-affiliate-link" },
    },
  },
  {
    name: "Maybelline Fit Me Foundation",
    slug: "maybelline-fit-me-foundation",
    category: "beauty",
    brand: "Maybelline",
    description: "Lightweight liquid foundation with SPF 18, natural coverage for all skin types",
    rating: 4.2,
    review_count: 97600,
    specs: { "Coverage": "Medium, Buildable", "Finish": "Natural Matte", "SPF": "18", "Size": "30ml" },
    prices: {
      amazon:   { price: 549, original: 699, link: "#amazon-affiliate-link" },
      flipkart: { price: 529, original: 699, link: "#flipkart-affiliate-link" },
      myntra:   { price: 499, original: 699, link: "#myntra-affiliate-link" },
    },
  },
  {
    name: "Canon EOS R50 Mirrorless",
    slug: "canon-eos-r50",
    category: "cameras",
    brand: "Canon",
    description: "Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor and 4K video",
    rating: 4.5,
    review_count: 8900,
    specs: { "Sensor": "24.2MP APS-C CMOS", "Video": "4K 30fps", "ISO": "100-32000", "Weight": "375g", "Mount": "RF Mount" },
    prices: {
      amazon:   { price: 59990, original: 69990, link: "#amazon-affiliate-link" },
      flipkart: { price: 57990, original: 69990, link: "#flipkart-affiliate-link" },
      croma:    { price: 61990, original: 69990, link: "#croma-affiliate-link" },
    },
  },
  {
    name: "Realme TechLife Robot Vacuum",
    slug: "realme-techlife-robot-vacuum",
    category: "home-kitchen",
    brand: "Realme",
    description: "Smart robot vacuum with 2500Pa suction, LiDAR navigation, and app control",
    rating: 4.0,
    review_count: 12400,
    specs: { "Suction": "2500Pa", "Battery": "5200mAh", "Runtime": "150 Min", "Navigation": "LiDAR + Gyroscope", "Dustbin": "600ml" },
    prices: {
      amazon:   { price: 10999, original: 15999, link: "#amazon-affiliate-link" },
      flipkart: { price: 10499, original: 15999, link: "#flipkart-affiliate-link" },
    },
  },
]

const productImages: Record<string, string> = {
  "boat-airdopes-141": "https://lh3.googleusercontent.com/aida-public/AB6AXuBDFGPLPhR5S6S154gYO990i01y18eGR7oehob-HfL2FkLmkFRn0G5AbuBVcrOFyhJMT5x7WVBUmduBMBFaZyIlxTCK9xoGlBoqVSOAIzZBD_mBHNNqaC2tZE2peQxuCiI_NUmsl-9wqTbdKrzS9oSYvQxunRtCScT0D2xiyjNdgjxEHynTmXicIbirtMy4ECPh5gsCWXbUUyXM1bTsJDoIslLjqFVFFz-irhaGlf81HCRynwJOKW7NGrdC-aSLn3_8cctaBYqWNx0",
  "iphone-15-128gb-black": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOcm4tLRPcVPCNbhodyXVeOOhDf1cHeaCw4cwin2-xNDhcrslWm6jGkrbHzFJy-lawFvvVRGyHx1CW7Jc42Q2HLow_3UZNZPuuZGqOLcseshh0GW7gey3OQsuR6vwFEy2luI1S-yZ2RZYoKjBnsjOhZe28sDwV1NPhrO-wc6q948gakkJMN5zdVHV6QWszpl7si3CWBXrygbwkZRffNId5V_atWFxSVtM6Un5LLguT9K98nD5Lh8XMinHIQ902NkySO3l4HM3M1g",
  "samsung-43-4k-smart-tv": "https://lh3.googleusercontent.com/aida-public/AB6AXuA2sjcw_vyGKzbaUSHpLCUuYtfZeVgCg8f6NhJq1NX2L0_1aC0O67EUGTpZokdZ6OsERhtn7kl5oASBuIeKGQRH6Vqs86ZYBjGqruuXbcdhJNyM_MWAlkEtBdG2aN2du4IxzpU9rOUczUB8ufiy0-RveT_emSAErYvCeaE1nsdYG-Ey050A_e_0VPaEvJxDZuJHZ6GN7UQtJaJzYBhajrrQvjcdiOZOnJUvGr9sWDo7p5OXUe4begFXukUPZiih9NyGhx9MCLcN_C8",
  "nike-air-max-270": "https://lh3.googleusercontent.com/aida-public/AB6AXuD_mzKdXKkOptAptZhJp_p8n1zPy1hLGF5RGgv0ZH0aC196wToTe31xNcuJnXvEFjfK5niL6W4ctMVF_XOAL7vEBbPi44QkTqYEYfyI1dLg7uz3y-lg0zI9MT-jWLeCwP7ICPi_LpR9VW_mRtSwQf0mynL_YGbAE-1mgNPe2eDu-YZNDBHkgPtek1K1N-5QkKF9EfvnP5gYGnpGAHPOOGnkpEgCEkyDmNwNJuY6myBqdrGMjEcdLZ2E6X0onCJO8LQqw6Sxy8-M1OI",
  "prestige-iris-750w-mixer-grinder": "https://lh3.googleusercontent.com/aida-public/AB6AXuA9BvugKzS1JeAff2Ot8jNYLoVS2IFl8jQgcC-E7fSwwybXpKvFqdMbpkpeonnsyzzxIkEfg1EKmtqPlQpdSvAQSWyrmnnvlly3AayYHBZGPW5pZhUTuMVQVp2fGQAm9jYjqjBpftclpux0yr8rmNUmZO0kyyU7qfiorPSwkGNSDvh1nDg0x2rAFGiIG5g42WvYlHz4-oZWdeVPSd6s0Zz7wvtv6JkNT6VPW2hqaKznN42eGndkZWfJ9QvHQeMYdBl3kUEGid5DfQQ",
  "macbook-air-m3-16-256": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOcm4tLRPcVPCNbhodyXVeOOhDf1cHeaCw4cwin2-xNDhcrslWm6jGkrbHzFJy-lawFvvVRGyHx1CW7Jc42Q2HLow_3UZNZPuuZGqOLcseshh0GW7gey3OQsuR6vwFEy2luI1S-yZ2RZYoKjBnsjOhZe28sDwV1NPhrO-wc6q948gakkJMN5zdVHV6QWszpl7si3CWBXrygbwkZRffNId5V_atWFxSVtM6Un5LLguT9K98nD5Lh8XMinHIQ902NkySO3l4HM3M1g",
  "asus-vivobook-15": "https://lh3.googleusercontent.com/aida-public/AB6AXuA2sjcw_vyGKzbaUSHpLCUuYtfZeVgCg8f6NhJq1NX2L0_1aC0O67EUGTpZokdZ6OsERhtn7kl5oASBuIeKGQRH6Vqs86ZYBjGqruuXbcdhJNyM_MWAlkEtBdG2aN2du4IxzpU9rOUczUB8ufiy0-RveT_emSAErYvCeaE1nsdYG-Ey050A_e_0VPaEvJxDZuJHZ6GN7UQtJaJzYBhajrrQvjcdiOZOnJUvGr9sWDo7p5OXUe4begFXukUPZiih9NyGhx9MCLcN_C8",
  "oneplus-nord-ce-4": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOcm4tLRPcVPCNbhodyXVeOOhDf1cHeaCw4cwin2-xNDhcrslWm6jGkrbHzFJy-lawFvvVRGyHx1CW7Jc42Q2HLow_3UZNZPuuZGqOLcseshh0GW7gey3OQsuR6vwFEy2luI1S-yZ2RZYoKjBnsjOhZe28sDwV1NPhrO-wc6q948gakkJMN5zdVHV6QWszpl7si3CWBXrygbwkZRffNId5V_atWFxSVtM6Un5LLguT9K98nD5Lh8XMinHIQ902NkySO3l4HM3M1g",
  "samsung-galaxy-s24-ultra": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOcm4tLRPcVPCNbhodyXVeOOhDf1cHeaCw4cwin2-xNDhcrslWm6jGkrbHzFJy-lawFvvVRGyHx1CW7Jc42Q2HLow_3UZNZPuuZGqOLcseshh0GW7gey3OQsuR6vwFEy2luI1S-yZ2RZYoKjBnsjOhZe28sDwV1NPhrO-wc6q948gakkJMN5zdVHV6QWszpl7si3CWBXrygbwkZRffNId5V_atWFxSVtM6Un5LLguT9K98nD5Lh8XMinHIQ902NkySO3l4HM3M1g",
  "sony-wh-1000xm5": "https://lh3.googleusercontent.com/aida-public/AB6AXuBDFGPLPhR5S6S154gYO990i01y18eGR7oehob-HfL2FkLmkFRn0G5AbuBVcrOFyhJMT5x7WVBUmduBMBFaZyIlxTCK9xoGlBoqVSOAIzZBD_mBHNNqaC2tZE2peQxuCiI_NUmsl-9wqTbdKrzS9oSYvQxunRtCScT0D2xiyjNdgjxEHynTmXicIbirtMy4ECPh5gsCWXbUUyXM1bTsJDoIslLjqFVFFz-irhaGlf81HCRynwJOKW7NGrdC-aSLn3_8cctaBYqWNx0",
  "noise-colorfit-pro-5": "https://lh3.googleusercontent.com/aida-public/AB6AXuBDFGPLPhR5S6S154gYO990i01y18eGR7oehob-HfL2FkLmkFRn0G5AbuBVcrOFyhJMT5x7WVBUmduBMBFaZyIlxTCK9xoGlBoqVSOAIzZBD_mBHNNqaC2tZE2peQxuCiI_NUmsl-9wqTbdKrzS9oSYvQxunRtCScT0D2xiyjNdgjxEHynTmXicIbirtMy4ECPh5gsCWXbUUyXM1bTsJDoIslLjqFVFFz-irhaGlf81HCRynwJOKW7NGrdC-aSLn3_8cctaBYqWNx0",
  "maybelline-fit-me-foundation": "https://lh3.googleusercontent.com/aida-public/AB6AXuD_mzKdXKkOptAptZhJp_p8n1zPy1hLGF5RGgv0ZH0aC196wToTe31xNcuJnXvEFjfK5niL6W4ctMVF_XOAL7vEBbPi44QkTqYEYfyI1dLg7uz3y-lg0zI9MT-jWLeCwP7ICPi_LpR9VW_mRtSwQf0mynL_YGbAE-1mgNPe2eDu-YZNDBHkgPtek1K1N-5QkKF9EfvnP5gYGnpGAHPOOGnkpEgCEkyDmNwNJuY6myBqdrGMjEcdLZ2E6X0onCJO8LQqw6Sxy8-M1OI",
  "canon-eos-r50": "https://lh3.googleusercontent.com/aida-public/AB6AXuA2sjcw_vyGKzbaUSHpLCUuYtfZeVgCg8f6NhJq1NX2L0_1aC0O67EUGTpZokdZ6OsERhtn7kl5oASBuIeKGQRH6Vqs86ZYBjGqruuXbcdhJNyM_MWAlkEtBdG2aN2du4IxzpU9rOUczUB8ufiy0-RveT_emSAErYvCeaE1nsdYG-Ey050A_e_0VPaEvJxDZuJHZ6GN7UQtJaJzYBhajrrQvjcdiOZOnJUvGr9sWDo7p5OXUe4begFXukUPZiih9NyGhx9MCLcN_C8",
  "realme-techlife-robot-vacuum": "https://lh3.googleusercontent.com/aida-public/AB6AXuA9BvugKzS1JeAff2Ot8jNYLoVS2IFl8jQgcC-E7fSwwybXpKvFqdMbpkpeonnsyzzxIkEfg1EKmtqPlQpdSvAQSWyrmnnvlly3AayYHBZGPW5pZhUTuMVQVp2fGQAm9jYjqjBpftclpux0yr8rmNUmZO0kyyU7qfiorPSwkGNSDvh1nDg0x2rAFGiIG5g42WvYlHz4-oZWdeVPSd6s0Zz7wvtv6JkNT6VPW2hqaKznN42eGndkZWfJ9QvHQeMYdBl3kUEGid5DfQQ",
  default: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDFGPLPhR5S6S154gYO990i01y18eGR7oehob-HfL2FkLmkFRn0G5AbuBVcrOFyhJMT5x7WVBUmduBMBFaZyIlxTCK9xoGlBoqVSOAIzZBD_mBHNNqaC2tZE2peQxuCiI_NUmsl-9wqTbdKrzS9oSYvQxunRtCScT0D2xiyjNdgjxEHynTmXicIbirtMy4ECPh5gsCWXbUUyXM1bTsJDoIslLjqFVFFz-irhaGlf81HCRynwJOKW7NGrdC-aSLn3_8cctaBYqWNx0",
}

export function getProductImage(slug: string): string {
  return productImages[slug] || productImages.default
}

export function getAllProducts(): SampleProduct[] {
  return sampleProducts
}

export function getProductBySlug(slug: string): SampleProduct | undefined {
  return sampleProducts.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): SampleProduct[] {
  return sampleProducts.filter(p => p.category === category)
}

export const categories = [
  { name: "Mobiles", slug: "mobiles", icon: "smartphone", count: 28 },
  { name: "Laptops", slug: "laptops", icon: "laptop_mac", count: 18 },
  { name: "Earbuds", slug: "earbuds", icon: "headphones", count: 15 },
  { name: "Fashion", slug: "fashion", icon: "checkroom", count: 22 },
  { name: "Home & Kitchen", slug: "home-kitchen", icon: "kitchen", count: 14 },
  { name: "Beauty", slug: "beauty", icon: "spa", count: 12 },
  { name: "Cameras", slug: "cameras", icon: "camera_alt", count: 9 },
  { name: "Accessories", slug: "accessories", icon: "watch", count: 20 },
]
