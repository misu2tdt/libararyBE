const { parse } = require('dotenv');
const prisma = require('../utils/prismaClient');

const createAuthor = async(req, res) =>{
    try{
        const{name, bio} = req.body;
        if(!name || !bio) {
            return res.status(400).json({message: "Missing required fileds"})
        }
        const author = await prisma.author.create({
            data: {name, bio}
        });
        res.status(201).json(author);

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAuthors = async(req, res) =>{
    try{
        const authors = await prisma.author.findMany();
        res.json(authors);

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

const getAuthorById = async(req, res) =>{
    try{
        const id = parseInt(req.params.id);
        const author = await prisma.author.findUnique( { where: {id} } );
        if(!author){
            res.status(404).json({message: 'Author Not Found'})
        }
        res.json(author)

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

const updateAuthor = async(req, res) =>{
    try{
        const id = parseInt(req.params.id);
        const {name, bio} = req.body;
        const updateAuthor = await prisma.author.update({
            where: {id},
            data: {name, bio}
        });
        res.json(updateAuthor);

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

const deleteAuthor = async(req, res) =>{
    try{
        const id = parseInt(req.params.id);
        await prisma.author.delete({
            where: {id}
        })
        res.json({message: 'Author deleted'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

module.exports = {
    createAuthor,
    getAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor
};