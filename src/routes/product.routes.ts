import { Router } from 'express'
import * as ProductController from '../controllers/product.controller'

const router = Router()

router.get('/', ProductController.index)
router.get('/create', ProductController.createForm)
router.get('/:id', ProductController.show)
router.post('/', ProductController.createAction)
router.get('/:id/edit', ProductController.editForm)
router.post('/:id/edit', ProductController.editAction)
router.post('/:id/delete', ProductController.deleteAction)

export default router
