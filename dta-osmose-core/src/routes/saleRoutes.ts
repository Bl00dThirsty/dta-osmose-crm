import express from 'express';

import { createSaleInvoice, getSaleInvoices, getSaleInvoiceById,  updateSaleStatus, updatePayment, deleteSaleInvoice, checkCustomerDebtStatus
} from '../controllers/saleController';
import authorize from "../authorize";

const router = express.Router();

router.post("/:institution/sale", authorize("create-sale"), createSaleInvoice);
router.get('/:institution/sale', authorize("readAll-sale"), getSaleInvoices);
router.get('/:id', authorize("view-sale"), getSaleInvoiceById);
router.get('/:institution/:customerId/debt-status', checkCustomerDebtStatus)
router.patch('/:institution/sale/:id/status',
    authorize("update-saleStatus"), 
    updateSaleStatus
);
router.patch('/:id/payment', authorize("update-salePayment"), updatePayment);
router.delete("/:id", authorize("delete-sale"), deleteSaleInvoice);

export default router;