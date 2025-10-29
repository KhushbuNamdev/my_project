import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'A complete Node.js, Express.js, and MongoDB backend API with JWT authentication, product management, and inventory tracking',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'phoneNumber', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the user',
              example: '60d21b4667d0d8992e610c85',
            },
            name: {
              type: 'string',
              description: 'The name of the user',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user',
              example: 'john@example.com',
            },
            phoneNumber: {
              type: 'string',
              description: 'The phone number of the user',
              example: '1234567890',
            },
            role: {
              type: 'string',
              enum: ['superadmin', 'wholesaler', 'sales'],
              default: 'sales',
              description: 'The role of the user',
              example: 'sales',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the user was last updated',
            },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'The password of the user',
              example: 'password123',
            },
          },
        },
        Token: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Error message describing the issue',
            },
            errors: {
              type: 'object',
              description: 'Validation errors',
              example: {
                email: 'Invalid email format',
                password: 'Password must be at least 6 characters long',
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Not authorized, token failed',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have required permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'User role sales is not authorized to access this route',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'User not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Validation error',
                errors: {
                  email: 'Please provide a valid email address',
                  password: 'Password must be at least 6 characters long',
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      Inventory: {
        type: 'object',
        required: ['productId'],
        properties: {
          _id: {
            type: 'string',
            description: 'The auto-generated ID of the inventory',
            example: '60d5ec9f8b3f8b3f8b3f8b3f'
          },
          productId: {
            type: 'string',
            description: 'Reference to the product',
            example: '60d5ec9f8b3f8b3f8b3f8b3f'
          },
          quantity: {
            type: 'number',
            description: 'Total quantity in stock',
            default: 0,
            example: 100
          },
          usedQuantity: {
            type: 'number',
            description: 'Quantity currently in use',
            default: 0,
            example: 10
          },
          availableQuantity: {
            type: 'number',
            description: 'Available quantity (quantity - usedQuantity)',
            readOnly: true,
            example: 90
          },
          status: {
            type: 'string',
            enum: ['in_stock', 'low_stock', 'out_of_stock'],
            description: 'Current stock status',
            default: 'out_of_stock',
            example: 'in_stock'
          },
          lowStockThreshold: {
            type: 'number',
            description: 'Threshold for low stock alert',
            default: 10,
            example: 20
          },
          lastRestocked: {
            type: 'string',
            format: 'date-time',
            description: 'Last restock date',
            example: '2023-01-01T00:00:00.000Z'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2023-01-01T00:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2023-01-01T00:00:00.000Z'
          }
        }
      },
      Product: {
        type: 'object',
        required: ['name', 'description', 'price', 'categoryId'],
        properties: {
          _id: {
            type: 'string',
            description: 'The auto-generated id of the product',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'The name of the product',
            example: 'Premium Quality T-Shirt',
          },
          description: {
            type: 'string',
            description: 'Detailed description of the product',
            example: 'High-quality cotton t-shirt with premium finish',
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Price of the product',
            example: 29.99,
          },
          categoryId: {
            type: 'string',
            description: 'ID of the category this product belongs to',
            example: '60d21b4667d0d8992e610c86',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'url',
            },
            description: 'Array of image URLs for the product',
            example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
          },
          stock: {
            type: 'integer',
            description: 'Available stock quantity',
            example: 100,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'out_of_stock'],
            default: 'active',
            description: 'Current status of the product',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time when the product was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time when the product was last updated',
          },
        },
      },
      Category: {
        type: 'object',
        required: ['name', 'description'],
        properties: {
          name: {
            type: 'string',
            description: 'Name of the category',
            example: 'Electronics',
            maxLength: 50
          },
          description: {
            type: 'string',
            description: 'Description of the category',
            example: 'Electronic gadgets and devices',
            maxLength: 500
          },
          image: {
            type: 'string',
            description: 'URL of the category image',
            example: 'https://example.com/images/electronics.jpg',
            format: 'uri'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            default: 'active',
            description: 'Status of the category'
          },
          parentId: {
            type: 'string',
            format: 'objectId',
            description: 'ID of the parent category',
            example: '507f1f77bcf86cd799439011'
          },
          isDeleted: {
            type: 'boolean',
            default: false,
            description: 'Soft delete flag'
          }
        }
      },
      // ... rest of the schemas ...
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const swaggerUiSetup = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'User Management API Documentation',
    customfavIcon: '/favicon.ico',
  }));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 API Documentation available at http://localhost:${process.env.PORT || 3000}/api-docs`);
};

export default swaggerUiSetup;
