const NurseInvoiceRouter = require('express').Router()
const { createNurseInvoice } = require('../controllers/NurseInvoiceController');
const { verifyBoth } = require('../middleware/authorization');

// POST: Generate Invoice
NurseInvoiceRouter.post('/generate',verifyBoth, createNurseInvoice);

module.exports = NurseInvoiceRouter;