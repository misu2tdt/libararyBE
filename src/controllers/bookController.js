const { parse } = require('dotenv');
const prisma = require('../utils/prismaClient');

const createBook = async (req, res) =>{
    try{
        const {title, description,  publishedYear, availableCopies, authorId, categoryId} = req.body;
        if(!title || !description || !publishedYear || !availableCopies || !authorId || !categoryId){
            return res.status(400).json({message: 'Missing Required Fields'});
        }
        //check foreign key
        const author = await prisma.author.findUnique({where: {id: authorId}});
        if(!author) {return res.status(404).json({message: 'Author Not Found'})};
        const category = await prisma.category.findUnique({where: {id: categoryId}});
        if(!category) {return res.status(404).json({message: 'Category Not Found'})};

        const book = await prisma.book.create({
            data: { title, description, publishedYear, availableCopies, authorId, categoryId}
        });
        res.status(201).json(book);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const getBooks = async(req, res) =>{
    try {
        const books = await prisma.book.findMany({
            include: {author: true, category: true}
        });
        res.json(books)
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Internal Server Error'});
    }

};

const getBookById = async(req,res) =>{
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
        const book = await prisma.book.findUnique({
            where: {id},
            include: {author: true, category: true}
        });
        if(!book) { return res.status(404).json({message:'Book Not Found'})};
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Internal Server Error'});
    }

};


//Trong updateBook chưa kiểm tra xem book tồn tại trước khi update → nếu Prisma gặp id không tồn tại sẽ lỗi 500, 
// bạn nên thêm catch riêng cho Prisma lỗi P2025 giống mình đã gợi ý ở trên.
//updateBook nên kiểm tra authorId, categoryId nếu thay đổi — hiện tại cho phép cập nhật authorId nhưng không kiểm tra nó có thực sự tồn tại không, dễ gây lỗi khóa ngoại.
//publishedYear chưa validate kiểu dữ liệu (nếu gửi text sẽ lỗi) — nên parseInt + validate năm >= 0
//có thể gom check validate vào middleware (ví dụ dùng zod hoặc express-validator) để controller gọn hơn

const updateBook = async(req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
        const{title, description,  publishedYear, availableCopies, authorId, categoryId} = req.body;
        const updatebook = await prisma.book.update({
            where: {id},
            data: {title, description,  publishedYear, availableCopies, authorId, categoryId}
        });
        res.json(updatebook)
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }

};

const deleteBook = async(req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
        await prisma.book.delete({
            where: {id}
        });
        res.json({message:'Book Deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};