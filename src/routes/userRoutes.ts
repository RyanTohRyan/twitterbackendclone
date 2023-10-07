import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post('/', (req,res)=>{
    const {email, name, username} = req.body;
    console.log(email, username,name);
    res.status(501).json({error: 'not implemented'});
})

router.get('/', async (req,res)=>{
    const allUser = await prisma.user.findMany()
    res.json(allUser);
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params;
    const user = await prisma.user.findUnique({where: {id: Number(id)}})
    res.json(user);
})

router.put('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: 'not implemented'});
})

router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: 'not implemented'});
})

export default router;