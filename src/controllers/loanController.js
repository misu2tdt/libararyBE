const prisma = require('../utils/prismaClient');

// Create a loan
const createLoan = async (req, res) => {
    try {
        const{userId, bookId, dueDate} = req.body;
        if(!userId || !bookId || !dueDate) {return res.status(400).json({message:'Missing Required Fields'})};
        const user = await prisma.user.findUnique({
        where:{id: userId}
    });
    if(!user) {return res.status(404).json({message:'User Not Found'})};

    const book = await prisma.book.findUnique({
        where:{id: bookId}
    });
    if(!book) {return res.status(404).json({message:'Book Not Found'})};
    if(book.availableCopies <=0) {return res.status(400).json({message:'No Available Copies'})};
    
    const loan = await prisma.loan.create({
        data:{
            bookId,
            userId,
            loanDate: new Date(),
            dueDate: new Date(dueDate)
        },
        include:{book: true, user: true}
    });
    await prisma.book.update({
        where:{id: bookId},
        data:{availableCopies: book.availableCopies - 1}
    });
    res.status(201).json(loan);
} catch(err){
    console.error(err);
    res.status(500).json({message:'Internal Server Error'});
}
};

// Get all loans
const getLoans = async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
    include: {user: true, book: true}});
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Internal Server Error'});
  }
};

// Get loan by ID
const getLoanById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const loan = await prisma.loan.findUnique({
            where:{id},
            include:{book: true, user: true}
        });
        if(!loan) {return res.status(404).json({message:'Loan Not Found'})};
        res.json(loan);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Internal Server Error'});
    }
};

// Return loan
const returnLoan = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const loan = await prisma.loan.findUnique({
            where: {id},
            include:{book: true, user: true}
        });
        if(!loan) return res.status(404).json({message: 'Loan Not Found'});
        if(loan.returnDate){
            return res.status(400).json({message: 'Loan already returned'});
        }
        const updateLoan = await prisma.loan.update({
            where:{id},
            data:{returnDate : new Date()},
            include:{book: true, user: true}
        });
        res.json(updateLoan);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Internal Server Error'});
    }

};

// Delete loan (optional)
/* const deleteLoan = async (req, res) => {
    try {
        const id = parseInt(rq.params.id);
        
    } catch (error) {
        
    }
}; */

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  returnLoan,
  //deleteLoan
};
