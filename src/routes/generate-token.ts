import { Router } from 'express';
import * as generateTokenController from '../controllers/generate-token';

const router = Router();

router.post('/generate-token', (req, res) => {
  generateTokenController.generateToken(req, res);
});

export default router;
