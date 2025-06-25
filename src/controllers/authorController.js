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


    }catch{
        
    }
};

const updateAuthor = async(req, res) =>{
    try{


    }catch{
        
    }
};

const deleteAuthor = async(req, res) =>{
    try{


    }catch{
        
    }
};

module.exports = {
    createAuthor,
    getAuthor,
    getAuthorById,
    updateAuthor,
    deleteAuthor
};