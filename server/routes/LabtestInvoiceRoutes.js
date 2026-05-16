const { createLabInvoice } = require('../controllers/LabtestInvoiceController');
const { verifyBoth } = require('../middleware/authorization');

const LabtestInvoiceRouter = require('express').Router()


// POST: Generate LabtestInvoice
LabtestInvoiceRouter.post('/generate',verifyBoth, createLabInvoice);

module.exports = LabtestInvoiceRouter;