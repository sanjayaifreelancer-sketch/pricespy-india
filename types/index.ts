export interface Product {
  id: string
  name: string
  slug: string
  category_id?: string
  brand: string
  image_url: string
  images: string[]
  video_url: string
  description: string
  specs: Record<string, string>
  featured: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Price {
  id: string
  product_id: string
  platform: Platform
  price: number
  original_price: number
  discount_percent: number
  affiliate_link: string
  in_stock: boolean
  last_updated: string
}

export interface PriceHistory {
  id: string
  product_id: string
  platform: string
  price: number
  recorded_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

export interface PriceAlert {
  id: string
  product_id: string
  email: string
  target_price: number
  is_active: boolean
  created_at: string
}

export type Platform =
  | 'amazon' | 'flipkart' | 'meesho' | 'snapdeal' | 'jiomart' | 'tatacliq' | 'indiamart'
  | 'myntra' | 'ajio' | 'bewakoof' | 'zivame' | 'clovia' | 'libas' | 'fabindia' | 'limeroad'
  | 'nykaa' | 'purplle' | 'mamaearth' | 'mcaffeine' | 'plum' | 'sugar'
  | 'bigbasket' | 'licious' | 'freshtohome' | 'countrydelight'
  | 'croma' | 'vijaysales' | 'boat' | 'noise'
  | 'lenskart' | 'coolwinks'
  | 'pepperfry' | 'urbanladder' | 'wakefit' | 'woodenstreet'
  | 'onemg' | 'netmeds' | 'pharmeasy' | 'healthkart' | 'apollo'
  | 'makemytrip' | 'goibibo' | 'ixigo' | 'easemytrip' | 'cleartrip' | 'yatra' | 'redbus'
  | 'bookmyshow'
  | 'cardekho' | 'cars24' | 'droom'
  | '99acres' | 'magicbricks' | 'housing' | 'nobroker'
  | 'policybazaar' | 'groww' | 'paytm'
  | 'firstcry' | 'hopscotch'
  | 'agrostar' | 'dehaat'
  | 'moglix' | 'industrybuying'

export const platformConfig: Record<Platform, { label: string; color: string; bg: string; group: string }> = {
  amazon:         { label: 'Amazon',       color: '#FF9900', bg: '#FFF3E0', group: 'General' },
  flipkart:       { label: 'Flipkart',     color: '#2874F0', bg: '#E3F0FF', group: 'General' },
  meesho:         { label: 'Meesho',       color: '#9C27B0', bg: '#F3E5F5', group: 'General' },
  snapdeal:       { label: 'Snapdeal',     color: '#E20E43', bg: '#FDE8ED', group: 'General' },
  jiomart:        { label: 'JioMart',      color: '#007A4B', bg: '#E6F7F0', group: 'General' },
  tatacliq:       { label: 'Tata CLiQ',    color: '#1A237E', bg: '#E8EAF6', group: 'General' },
  indiamart:      { label: 'IndiaMART',    color: '#E65100', bg: '#FFF3E0', group: 'General' },
  myntra:         { label: 'Myntra',       color: '#FF3F6C', bg: '#FFE4EC', group: 'Fashion' },
  ajio:           { label: 'Ajio',         color: '#FD5068', bg: '#FFE8EC', group: 'Fashion' },
  bewakoof:       { label: 'Bewakoof',     color: '#FF6F00', bg: '#FFF3E0', group: 'Fashion' },
  zivame:         { label: 'Zivame',       color: '#D81B60', bg: '#FCE4EC', group: 'Fashion' },
  clovia:         { label: 'Clovia',       color: '#E91E63', bg: '#FCE4EC', group: 'Fashion' },
  libas:          { label: 'Libas',        color: '#C62828', bg: '#FFEBEE', group: 'Fashion' },
  fabindia:       { label: 'FabIndia',     color: '#BF360C', bg: '#FBE9E7', group: 'Fashion' },
  limeroad:       { label: 'Limeroad',     color: '#FF4081', bg: '#FCE4EC', group: 'Fashion' },
  nykaa:          { label: 'Nykaa',        color: '#F0006C', bg: '#FDE0EC', group: 'Beauty' },
  purplle:        { label: 'Purplle',      color: '#9C27B0', bg: '#F3E5F5', group: 'Beauty' },
  mamaearth:      { label: 'Mamaearth',    color: '#4CAF50', bg: '#E8F5E9', group: 'Beauty' },
  mcaffeine:      { label: 'mCaffeine',    color: '#3E2723', bg: '#EFEBE9', group: 'Beauty' },
  plum:           { label: 'Plum',         color: '#E91E63', bg: '#FCE4EC', group: 'Beauty' },
  sugar:          { label: 'Sugar',        color: '#FF4081', bg: '#FCE4EC', group: 'Beauty' },
  bigbasket:      { label: 'BigBasket',    color: '#4CAF50', bg: '#E8F5E9', group: 'Grocery' },
  licious:        { label: 'Licious',      color: '#D32F2F', bg: '#FFEBEE', group: 'Grocery' },
  freshtohome:    { label: 'FreshToHome',  color: '#1B5E20', bg: '#E8F5E9', group: 'Grocery' },
  countrydelight: { label: 'Country D.',   color: '#FF6F00', bg: '#FFF8E1', group: 'Grocery' },
  croma:          { label: 'Croma',        color: '#008000', bg: '#E8F5E9', group: 'Electronics' },
  vijaysales:     { label: 'Vijay Sales',  color: '#004D40', bg: '#E0F2F1', group: 'Electronics' },
  boat:           { label: 'boAt',         color: '#1A237E', bg: '#E8EAF6', group: 'Electronics' },
  noise:          { label: 'Noise',        color: '#311B92', bg: '#EDE7F6', group: 'Electronics' },
  lenskart:       { label: 'Lenskart',     color: '#00A2E1', bg: '#E3F2FD', group: 'Eyewear' },
  coolwinks:      { label: 'Coolwinks',    color: '#1565C0', bg: '#E3F2FD', group: 'Eyewear' },
  pepperfry:      { label: 'Pepperfry',    color: '#FF6F00', bg: '#FFF3E0', group: 'Furniture' },
  urbanladder:    { label: 'Urban Ladder', color: '#4E342E', bg: '#EFEBE9', group: 'Furniture' },
  wakefit:        { label: 'Wakefit',      color: '#1565C0', bg: '#E3F2FD', group: 'Furniture' },
  woodenstreet:   { label: 'Wooden St.',   color: '#5D4037', bg: '#EFEBE9', group: 'Furniture' },
  onemg:          { label: '1mg',          color: '#00897B', bg: '#E0F2F1', group: 'Health' },
  netmeds:        { label: 'Netmeds',      color: '#00A2E1', bg: '#E3F2FD', group: 'Health' },
  pharmeasy:      { label: 'PharmEasy',    color: '#4CAF50', bg: '#E8F5E9', group: 'Health' },
  healthkart:     { label: 'Healthkart',   color: '#E91E63', bg: '#FCE4EC', group: 'Health' },
  apollo:         { label: 'Apollo',       color: '#1565C0', bg: '#E3F2FD', group: 'Health' },
  makemytrip:     { label: 'MakeMyTrip',   color: '#00A2E1', bg: '#E3F2FD', group: 'Travel' },
  goibibo:        { label: 'Goibibo',      color: '#FF6F00', bg: '#FFF3E0', group: 'Travel' },
  ixigo:          { label: 'ixigo',        color: '#1565C0', bg: '#E3F2FD', group: 'Travel' },
  easemytrip:     { label: 'EaseMyTrip',   color: '#4CAF50', bg: '#E8F5E9', group: 'Travel' },
  cleartrip:      { label: 'Cleartrip',    color: '#E91E63', bg: '#FCE4EC', group: 'Travel' },
  yatra:          { label: 'Yatra',        color: '#FF5722', bg: '#FBE9E7', group: 'Travel' },
  redbus:         { label: 'RedBus',       color: '#D32F2F', bg: '#FFEBEE', group: 'Travel' },
  bookmyshow:     { label: 'BookMyShow',   color: '#E91E63', bg: '#FCE4EC', group: 'Events' },
  cardekho:       { label: 'CarDekho',     color: '#1565C0', bg: '#E3F2FD', group: 'Automobile' },
  cars24:         { label: 'Cars24',       color: '#1B5E20', bg: '#E8F5E9', group: 'Automobile' },
  droom:          { label: 'Droom',        color: '#FF6F00', bg: '#FFF3E0', group: 'Automobile' },
  '99acres':      { label: '99Acres',      color: '#FF6F00', bg: '#FFF3E0', group: 'Real Estate' },
  magicbricks:    { label: 'MagicBricks',  color: '#D32F2F', bg: '#FFEBEE', group: 'Real Estate' },
  housing:        { label: 'Housing.com',  color: '#00897B', bg: '#E0F2F1', group: 'Real Estate' },
  nobroker:       { label: 'NoBroker',     color: '#1565C0', bg: '#E3F2FD', group: 'Real Estate' },
  policybazaar:   { label: 'PolicyBazaar', color: '#00A2E1', bg: '#E3F2FD', group: 'Fintech' },
  groww:          { label: 'Groww',        color: '#4CAF50', bg: '#E8F5E9', group: 'Fintech' },
  paytm:          { label: 'Paytm',        color: '#00BAF2', bg: '#E3F2FD', group: 'Fintech' },
  firstcry:       { label: 'FirstCry',     color: '#E91E63', bg: '#FCE4EC', group: 'Baby & Kids' },
  hopscotch:      { label: 'Hopscotch',    color: '#FF6F00', bg: '#FFF3E0', group: 'Baby & Kids' },
  agrostar:       { label: 'AgroStar',     color: '#4CAF50', bg: '#E8F5E9', group: 'Agriculture' },
  dehaat:         { label: 'DeHaat',       color: '#00897B', bg: '#E0F2F1', group: 'Agriculture' },
  moglix:         { label: 'Moglix',       color: '#1565C0', bg: '#E3F2FD', group: 'B2B' },
  industrybuying: { label: 'IndustryBuy',  color: '#E65100', bg: '#FFF3E0', group: 'B2B' },
}

export const platformGroups = [
  'General', 'Fashion', 'Beauty', 'Grocery', 'Electronics', 'Eyewear',
  'Furniture', 'Health', 'Travel', 'Events', 'Automobile', 'Real Estate',
  'Fintech', 'Baby & Kids', 'Agriculture', 'B2B'
]

export interface SampleProduct {
  name: string
  slug: string
  category: string
  brand: string
  description: string
  image_url?: string
  images?: string[]
  video_url?: string
  specs?: Record<string, string>
  rating: number
  review_count: number
  prices: Partial<Record<Platform, { price: number; original: number; link: string; in_stock?: boolean }>>
}

export interface AdminStats {
  totalProducts: number
  totalCategories: number
  totalPlatforms: number
  totalPrices: number
  recentProducts: Product[]
}
