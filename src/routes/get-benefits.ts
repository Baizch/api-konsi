import { Router } from 'express';
import * as getBenefitsController from '../controllers/get-benefits';

const router = Router();

router.get('/get-benefits', (req, res) => {
  getBenefitsController.getBenefitsController(req, res);
});

export default router;
