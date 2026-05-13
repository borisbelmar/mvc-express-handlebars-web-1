import prisma from '../lib/prisma'

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } })

export const create = (data: { email: string; password: string }) =>
  prisma.user.create({ data })