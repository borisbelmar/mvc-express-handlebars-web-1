import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
})

export type ProductInput = z.infer<typeof productSchema>
