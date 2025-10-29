import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../validations/product.validation.js';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController
} from '../controllers/product/index.js';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

const router = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  protect,
  validate(createProductSchema),
  createProductController
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with optional filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, out_of_stock]
 *         description: Filter by product status
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter products by name or description
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  getAllProductsController
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  getProductByIdController
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  protect,
  validate(updateProductSchema),
  updateProductController
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  protect,
  deleteProductController
);

export default router;
