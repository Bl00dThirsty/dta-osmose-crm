import express from 'express';

import { createSaleInvoice, getSaleInvoices, getSaleInvoiceById,  updateSaleStatus } from '../controllers/saleController';
import authorize from "../authorize";

const router = express.Router();

router.post("/:institution/sale", authorize("create-product"), createSaleInvoice);
router.get('/:institution/sale', getSaleInvoices);
router.get('/:id', getSaleInvoiceById);
// src/routes/saleRoutes.ts
router.patch('/:institution/sale/:id/status',
    authorize("create-product"), 
    updateSaleStatus
);

export default router;