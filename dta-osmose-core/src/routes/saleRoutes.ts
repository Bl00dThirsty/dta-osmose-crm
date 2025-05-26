import express from 'express';
import { createSaleInvoice, getSaleInvoices, getSaleInvoiceById } from '../controllers/saleController';


const router = express.Router();

router.post("/:institution/sale", createSaleInvoice);
router.get('/:institution/sale', getSaleInvoices);
router.get('/:id', getSaleInvoiceById);

export default router;