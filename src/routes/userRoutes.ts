import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req,res)=>{
    const {email, name, username} = req.body;
    
    try{
        const result = await prisma.user.create({
            data: {email, name,username, bio: "Hello I new twitter"} ,
        })
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json(err);
    }
  

   
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

router.put('/:id', async (req,res)=>{
    const {id} = req.params;
    const {bio, name, image} = req.body;

    try {
        const result = await prisma.user.update({
            where: {id: Number(id)},
            data: {bio, name, image}
        });
        res.json(result);
    }catch (err){
        res.status(400).json(err);
    }
   
})

router.delete('/:id', async (req,res)=>{
    const {id} = req.params;
   await prisma.user.delete({where: {id: Number(id)}})
    res.status(200).json({error: 'deleted'});
})

export default router;