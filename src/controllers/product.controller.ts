import { Request, Response } from 'express'
import * as ProductModel from '../models/product.model'

export const index = (_req: Request, res: Response): void => {
  const products = ProductModel.getAll()
  res.render('products/index', { products })
}

export const show = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string)
  const product = ProductModel.getById(id)
  if (!product) {
    res.status(404).render('404', { message: 'Producto no encontrado' })
    return
  }
  res.render('products/show', { product })
}

export const createForm = (_req: Request, res: Response): void => {
  res.render('products/create')
}

export const createAction = (req: Request, res: Response): void => {
  const { name, price, description } = req.body
  const newProduct = ProductModel.create({ name, price: Number(price), description })
  res.redirect(`/products/${newProduct.id}`)
}

export const editForm = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string)
  const product = ProductModel.getById(id)
  if (!product) {
    res.status(404).render('404', { message: 'Producto no encontrado' })
    return
  }
  res.render('products/edit', { product })
}

export const editAction = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string)
  const { name, price, description } = req.body
  const updated = ProductModel.update(id, { name, price: Number(price), description })
  if (!updated) {
    res.status(404).render('404', { message: 'Producto no encontrado' })
    return
  }
  res.redirect(`/products/${id}`)
}

export const deleteAction = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string)
  const deleted = ProductModel.remove(id)
  if (!deleted) {
    res.status(404).render('404', { message: 'Producto no encontrado' })
    return
  }
  res.redirect('/products')
}
