import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();


router.post('/', async (req,res)=>{
    const {content, image, userId} = req.body;
    
    try{
        const result = await prisma.tweet.create({
            data: { content,image,userId} ,
        })
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get('/', async (req,res)=>{
    const allTweets = await prisma.tweet.findMany({
        include: {user:{select: {id: true, name: true,username: true,image: true}
    }}});
    res.status(200).json(allTweets);
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params;
    const tweet = await prisma.tweet.findUnique({where: {id: Number(id)},
    include: {user: true}
})
    if(!tweet) {
        console.log("kekw");
       return res.status(404).json({error: "no tweet"});
    }
    res.status(200).json(tweet);
})

router.put('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: 'not implemented'});
})

router.delete('/:id', async (req,res)=>{
    const {id} = req.params;
    await prisma.tweet.delete({where: {id: Number(id)}})
    res.status(501).json({error: 'not implemented'});
})

export default router;