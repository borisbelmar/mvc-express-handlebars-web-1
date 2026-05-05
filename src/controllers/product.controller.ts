import { Request, Response } from 'express'
import * as ProductModel from '../models/product.model'

export const index = async (_req: Request, res: Response): Promise<void> => {
  const products = await ProductModel.getAll()
  res.render('products/index', { products })
}

export const show = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string)
  const product = await ProductModel.getById(id)
  if (!product) {
    res.status(404).render('404', { message: 'Producto no encontrado' })
    return
  }
  res.render('products/show', { product })
}

export const createForm = (_req: Request, res: Response): void => {
  res.render('products/create')
}

export const createAction = async (req: Request, res: Response): Promise<void> => {
  const { name, price, description } = req.body
  const newProduct = await ProductModel.create({ name, price: Number(price), description })
  res.redirect(`/products/${newProduct.id}`)
}

export const editForm = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string)
  const product = await ProductModel.getById(id)
  if (!product) {
    res.status(404).render('404', { message: 'Producto no encontrado' })
    return
  }
  res.render('products/edit', { product })
}

export const editAction = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string)
  const { name, price, description } = req.body
  try {
    await ProductModel.update(id, { name, price: Number(price), description })
    res.redirect(`/products/${id}`)
  } catch {
    res.status(404).render('404', { message: 'Producto no encontrado' })
  }
}

export const deleteAction = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string)
  try {
    await ProductModel.remove(id)
    res.redirect('/products')
  } catch {
    res.status(404).render('404', { message: 'Producto no encontrado' })
  }
}
