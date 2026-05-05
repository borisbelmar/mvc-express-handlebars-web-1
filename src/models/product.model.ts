export interface Product {
  id: number
  name: string
  price: number
  description: string
}

const products: Product[] = [
  { id: 1, name: 'Pro Laptop', price: 999990, description: 'High-performance laptop.' },
  { id: 2, name: 'Wireless Mouse', price: 29990, description: 'Ergonomic mouse.' },
  { id: 3, name: 'Mechanical Keyboard', price: 79990, description: 'Blue switches.' },
]

export const getAll = (): Product[] => {
  return products
}

export const getById = (id: number): Product | undefined => {
  return products.find(p => p.id === id)
}

export const create = (data: Omit<Product, 'id'>): Product => {
  const newProduct: Product = { id: products.length + 1, ...data }
  products.push(newProduct)
  return newProduct
}

export const update = (id: number, data: Omit<Product, 'id'>): Product | undefined => {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return undefined
  products[index] = { id, ...data }
  return products[index]
}

export const remove = (id: number): boolean => {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false
  products.splice(index, 1)
  return true
}
