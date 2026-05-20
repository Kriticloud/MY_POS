export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'MyPOS API',
    version: '1.0.0',
    description: 'Point of Sale System API Documentation',
    contact: { name: 'MyPOS Support' },
  },
  servers: [
    { url: '/api', description: 'API Server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
      LoginRequest: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 6 } } },
      LoginResponse: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { user: { type: 'object' }, accessToken: { type: 'string' }, refreshToken: { type: 'string' } } } } },
      Product: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, price: { type: 'number' }, sku: { type: 'string' }, barcode: { type: 'string' }, categoryId: { type: 'string' }, isActive: { type: 'boolean' } } },
      Order: { type: 'object', properties: { id: { type: 'string' }, orderNumber: { type: 'string' }, status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'] }, totalAmount: { type: 'number' }, items: { type: 'array' } } },
      Customer: { type: 'object', properties: { id: { type: 'string' }, firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, loyaltyPoints: { type: 'integer' } } },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: { tags: ['System'], summary: 'Health check', security: [], responses: { '200': { description: 'Server is healthy' } } },
    },
    '/auth/login': {
      post: { tags: ['Auth'], summary: 'Login', security: [], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { '200': { description: 'Login successful' }, '401': { description: 'Invalid credentials' }, '429': { description: 'Account locked' } } },
    },
    '/auth/register': {
      post: { tags: ['Auth'], summary: 'Register new user', security: [], responses: { '201': { description: 'User created' }, '409': { description: 'Email already exists' } } },
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Refresh access token', security: [], responses: { '200': { description: 'New tokens' }, '401': { description: 'Invalid refresh token' } } },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Get current user profile', responses: { '200': { description: 'User profile' } } },
      put: { tags: ['Auth'], summary: 'Update profile', responses: { '200': { description: 'Updated profile' } } },
    },
    '/auth/change-password': {
      post: { tags: ['Auth'], summary: 'Change password', responses: { '200': { description: 'Password changed' } } },
    },
    '/products': {
      get: { tags: ['Products'], summary: 'List all products', parameters: [{ name: 'businessType', in: 'query', schema: { type: 'string' } }, { name: 'categoryId', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'Array of products' } } },
      post: { tags: ['Products'], summary: 'Create product', responses: { '201': { description: 'Product created' } } },
    },
    '/products/{id}': {
      get: { tags: ['Products'], summary: 'Get product by ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Product details' } } },
      put: { tags: ['Products'], summary: 'Update product', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Updated product' } } },
      delete: { tags: ['Products'], summary: 'Delete product', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' } } },
    },
    '/categories': {
      get: { tags: ['Categories'], summary: 'List categories', responses: { '200': { description: 'Array of categories' } } },
      post: { tags: ['Categories'], summary: 'Create category', responses: { '201': { description: 'Category created' } } },
    },
    '/orders': {
      get: { tags: ['Orders'], summary: 'List orders', responses: { '200': { description: 'Array of orders' } } },
      post: { tags: ['Orders'], summary: 'Create order', responses: { '201': { description: 'Order created' } } },
    },
    '/orders/{id}/status': {
      put: { tags: ['Orders'], summary: 'Update order status', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Status updated' } } },
    },
    '/orders/{id}/void': {
      put: { tags: ['Orders'], summary: 'Void order (Admin/Manager only)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Order voided' }, '403': { description: 'Forbidden' } } },
    },
    '/orders/{id}/refund': {
      put: { tags: ['Orders'], summary: 'Refund order (Admin/Manager only)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Order refunded' }, '403': { description: 'Forbidden' } } },
    },
    '/customers': {
      get: { tags: ['Customers'], summary: 'List customers', responses: { '200': { description: 'Array of customers' } } },
      post: { tags: ['Customers'], summary: 'Create customer', responses: { '201': { description: 'Customer created' } } },
    },
    '/tables': {
      get: { tags: ['Tables'], summary: 'List tables', responses: { '200': { description: 'Array of tables' } } },
    },
    '/inventory': {
      get: { tags: ['Inventory'], summary: 'List inventory', responses: { '200': { description: 'Array of inventory items' } } },
    },
    '/reports/sales': {
      get: { tags: ['Reports'], summary: 'Sales report', parameters: [{ name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } }, { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } }], responses: { '200': { description: 'Sales data' } } },
    },
    '/reports/daily': {
      get: { tags: ['Reports'], summary: 'Daily summary', responses: { '200': { description: 'Daily totals' } } },
    },
    '/exchange-rates': {
      get: { tags: ['Exchange Rates'], summary: 'Get live exchange rates', security: [], responses: { '200': { description: 'Exchange rates with base USD' } } },
    },
    '/exchange-rates/convert': {
      get: { tags: ['Exchange Rates'], summary: 'Convert currency', security: [], parameters: [{ name: 'from', in: 'query', required: true, schema: { type: 'string' } }, { name: 'to', in: 'query', required: true, schema: { type: 'string' } }, { name: 'amount', in: 'query', required: true, schema: { type: 'number' } }], responses: { '200': { description: 'Converted amount' } } },
    },
    '/gift-cards': {
      get: { tags: ['Gift Cards'], summary: 'List gift cards', responses: { '200': { description: 'Array of gift cards' } } },
      post: { tags: ['Gift Cards'], summary: 'Create gift card', responses: { '201': { description: 'Gift card created' } } },
    },
    '/upload': {
      post: { tags: ['Upload'], summary: 'Upload a file', requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } }, responses: { '200': { description: 'File URL' } } },
    },
    '/settings': {
      get: { tags: ['Settings'], summary: 'Get app settings', responses: { '200': { description: 'Settings object' } } },
      put: { tags: ['Settings'], summary: 'Update settings', responses: { '200': { description: 'Updated settings' } } },
    },
    '/employees': {
      get: { tags: ['Employees'], summary: 'List employees (Admin/Manager)', responses: { '200': { description: 'Array of employees' } } },
    },
    '/backups': {
      get: { tags: ['Backups'], summary: 'List backups', responses: { '200': { description: 'Array of backups' } } },
      post: { tags: ['Backups'], summary: 'Create backup', responses: { '201': { description: 'Backup created' } } },
    },
  },
  tags: [
    { name: 'System', description: 'System endpoints' },
    { name: 'Auth', description: 'Authentication & authorization' },
    { name: 'Products', description: 'Product management' },
    { name: 'Categories', description: 'Category management' },
    { name: 'Orders', description: 'Order management' },
    { name: 'Customers', description: 'Customer management' },
    { name: 'Tables', description: 'Table management' },
    { name: 'Inventory', description: 'Inventory tracking' },
    { name: 'Reports', description: 'Business reports' },
    { name: 'Exchange Rates', description: 'Currency exchange' },
    { name: 'Gift Cards', description: 'Gift card management' },
    { name: 'Upload', description: 'File upload' },
    { name: 'Settings', description: 'App settings' },
    { name: 'Employees', description: 'Employee management' },
    { name: 'Backups', description: 'Database backups' },
  ],
};
