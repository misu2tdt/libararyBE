const express = require('express');
const router = express.Router();

const{
    createBook,
    getBooks, 
    getBookById,
    updateBook,
    deleteBook,
    getBookByCategory,
} = require('../controllers/bookController');

router.post('/', createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.get('/category/:categoryId', getBookByCategory);

module.exports = router;