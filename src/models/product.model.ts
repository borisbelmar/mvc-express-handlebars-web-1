import prisma from '../lib/prisma'
import type { Prisma } from '../generated/prisma/client'

export const getAll = async () => {
  return await prisma.product.findMany()
}

export const getById = async (id: number) => {
  return await prisma.product.findUnique({ where: { id } })
}

export const create = async (data: Prisma.ProductCreateInput) => {
  return await prisma.product.create({ data })
}

export const update = async (id: number, data: Prisma.ProductUpdateInput) => {
  return await prisma.product.update({ where: { id }, data })
}

export const remove = async (id: number) => {
  return await prisma.product.delete({ where: { id } })
}
