const express = require('express');
const router = express.Router();
const{createLoan, getLoans, getLoanById, returnLoan} = require('../controllers/loanController');

router.post('/', createLoan);
router.get('/', getLoans);
router.get('/:id', getLoanById);
router.put('/:id/return', returnLoan);

module.exports = router;