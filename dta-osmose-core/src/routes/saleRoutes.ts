import express from 'express';

import { createSaleInvoice, getSaleInvoices, getSaleInvoiceById } from '../controllers/saleController';
import authorize from "../authorize";

const router = express.Router();

router.post("/:institution/sale", authorize("create-product"), createSaleInvoice);
router.get('/:institution/sale', getSaleInvoices);
router.get('/:id', getSaleInvoiceById);

export default router;