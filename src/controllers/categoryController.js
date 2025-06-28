const { parse } = require('dotenv');
const prisma = require('../utils/prismaClient');

const createCategory = async (req, res) =>{
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({message: 'Missing required fields'});
        }

        const category = await prisma.category.create({
            data: {name, description}
        });

        res.status(201).json(category);

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

const getCategories = async (req, res) =>{
    try{
        const categories = await prisma.category.findMany();
        res.json(categories);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const getCategoryById = async (req, res) =>{
    try{
        const id = parseInt(req.params.id);

        const category = await prisma.category.findUnique({
            where: {id}
        });

        if(!category){
            return res.status(404).json({message: 'Category Not Found'});
        }
        res.json(category);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};


//kiểm tra xem category tồn tại trước khi update, như mình gợi ý bên trên (bắt lỗi P2025).
//Validate độ dài name, description nếu muốn tránh spam
const updateCategory = async (req, res) =>{
    try{
        const id = parseInt(req.params.id);
        const {name, description} = req.body;

        const updateCategory = await prisma.category.update({
            where: {id},
            data: {name, description}
        });
        res.json(updateCategory)
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const deleteCategory = async (req, res) =>{
    try{
        const id = parseInt(req.params.id);

        const deleteCategory = await prisma.category.delete({
            where: {id}
        });
        res.json({message: 'Category Deleted'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
