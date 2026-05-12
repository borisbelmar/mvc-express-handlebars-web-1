import { Request, Response } from 'express'
import * as ProductModel from '../models/product.model'
import { productSchema } from '../schemas/product.schemas'
import { formatZodErrors } from '../lib/parseError'

export const index = async (_req: Request, res: Response) => {
  const products = await ProductModel.getAll()
  res.render('products/index', { products })
}

export const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string)
  const product = await ProductModel.getById(id)
  if (!product) return res.status(404).render('404', { message: 'Producto no encontrado' })
  res.render('products/show', { product })
}

export const createForm = (_req: Request, res: Response) => {
  res.render('products/create')
}

export const createAction = async (req: Request, res: Response) => {
  const result = productSchema.safeParse(req.body)
  if (!result.success) {
    return res.render('products/create', {
      errors: formatZodErrors(result.error),
      values: req.body,
    })
  }
  const product = await ProductModel.create(result.data)
  res.redirect(`/products/${product.id}`)
}

export const editForm = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string)
  const product = await ProductModel.getById(id)
  if (!product) return res.status(404).render('404', { message: 'Producto no encontrado' })
  res.render('products/edit', { product })
}

export const editAction = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string)
  const result = productSchema.safeParse(req.body)
  if (!result.success) {
    const product = await ProductModel.getById(id)
    return res.render('products/edit', {
      product,
      errors: formatZodErrors(result.error),
    })
  }
  try {
    await ProductModel.update(id, result.data)
    res.redirect(`/products/${id}`)
  } catch {
    res.status(404).render('404', { message: 'Producto no encontrado' })
  }
}

export const deleteAction = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string)
  try {
    await ProductModel.remove(id)
    res.redirect('/products')
  } catch {
    res.status(404).render('404', { message: 'Producto no encontrado' })
  }
}