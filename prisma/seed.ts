/// <reference types="node" />
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Limpiar datos existentes para poder ejecutar el seed múltiples veces
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  const hash = await bcrypt.hash('123456', 10)

  const users = await Promise.all([
    prisma.user.create({ data: { email: 'alice@example.com', password: hash } }),
    prisma.user.create({ data: { email: 'bob@example.com', password: hash } }),
  ])

  const products = [
    { name: 'Pro Laptop', price: 999990, description: 'High-performance laptop with 32GB RAM and 1TB SSD.', userId: users[0].id },
    { name: 'Wireless Mouse', price: 29990, description: 'Ergonomic wireless mouse with adjustable DPI.', userId: users[0].id },
    { name: 'Mechanical Keyboard', price: 79990, description: 'Mechanical keyboard with blue switches and RGB.', userId: users[0].id },
    { name: 'Monitor 27" 4K', price: 349990, description: '27-inch 4K UHD monitor with HDR support.', userId: users[1].id },
    { name: 'USB-C Hub', price: 45990, description: '7-in-1 USB-C hub with HDMI, SD card and USB 3.0.', userId: users[1].id },
    { name: 'Webcam HD', price: 59990, description: '1080p webcam with built-in microphone and privacy shutter.', userId: users[0].id },
    { name: 'Noise Canceling Headphones', price: 149990, description: 'Over-ear Bluetooth headphones with active noise cancellation.', userId: users[1].id },
    { name: 'Desk Lamp LED', price: 39990, description: 'Adjustable LED desk lamp with 5 brightness levels.', userId: users[0].id },
  ]

  await prisma.product.createMany({ data: products })

  const count = await prisma.product.count()
  console.log(`Inserted ${count} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
