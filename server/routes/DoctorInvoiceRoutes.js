const DoctorInvoiceRouter = require('express').Router()
const { createDoctorInvoice } = require('../controllers/DoctorInvoiceController');
const { verifyBoth } = require('../middleware/authorization');

// POST: Generate DoctorInvoice
DoctorInvoiceRouter.post('/generate', verifyBoth, createDoctorInvoice);

module.exports = DoctorInvoiceRouter;