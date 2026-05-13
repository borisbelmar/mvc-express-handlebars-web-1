import prisma from '../lib/prisma'
import type { Prisma } from '../generated/prisma/client'

export const getAll = async (userId: number) => {
  return await prisma.product.findMany({ where: { userId } })
}

export const getById = async (id: number, userId: number) => {
  return await prisma.product.findFirst({ where: { id, userId } })
}

export const create = async (data: Prisma.ProductUncheckedCreateInput) => {
  return await prisma.product.create({ data })
}

export const update = async (id: number, userId: number, data: Omit<Prisma.ProductUncheckedCreateInput, 'userId'>) => {
  return await prisma.product.update({ where: { id, userId }, data })
}

export const remove = async (id: number, userId: number) => {
  return await prisma.product.delete({ where: { id, userId } })
}
