const MedicineInvoiceRouter = require('express').Router()
const { createMedicineInvoice } = require('../controllers/MedicineInvoiceController');
const { verifyBoth } = require('../middleware/authorization');

// POST: Generate Invoice
MedicineInvoiceRouter.post('/generate',verifyBoth, createMedicineInvoice);

module.exports = MedicineInvoiceRouter;