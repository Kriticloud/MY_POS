import { Router, Request, Response } from 'express';
import { ProductController } from './product.controller';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const router = Router();
const controller = new ProductController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/barcode/:barcode', controller.getByBarcode);

// Image upload (base64)
router.post('/:id/image', async (req: Request, res: Response) => {
  const { image } = req.body; // base64 string
  if (!image) { res.status(400).json({ error: 'Image data required' }); return; }

  const uploadDir = path.resolve(__dirname, '../../../uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const matches = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/);
  if (!matches) { res.status(400).json({ error: 'Invalid image format. Use base64 data URI' }); return; }

  const ext = matches[1];
  const data = matches[2];
  const filename = `${crypto.randomUUID()}.${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(data, 'base64'));

  const imageUrl = `/uploads/${filename}`;
  const product = await prisma.product.update({ where: { id: req.params.id }, data: { image: imageUrl } });
  res.json(product);
});

export { router as productRouter };
