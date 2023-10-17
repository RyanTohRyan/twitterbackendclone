import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const EMAIL_TOKEN_EXPIRATION_IN_MINUTES = 10;

const router = Router();
const prisma = new PrismaClient();

function generateEmailToken(): string {
    return Math.floor(10000000 + Math.random()*9000000).toString();
}

router.post('/login', async (req, res) => {
    const {email}= req.body;

    const emailToken = generateEmailToken();
    const expiration = new Date(
        new Date().getTime() + EMAIL_TOKEN_EXPIRATION_IN_MINUTES * 60 *1000
    );

try{
    const createdToken = await prisma.token.create({
        data : {
            type: "EMAIL",
            emailToken,
            expiration,
            user: {
                connectOrCreate: {
                    where: {email},
                    create: {email},
                }
            }
        }
    })

    console.log(createdToken);
    res.sendStatus(200);
} catch(e){
    console.log(e);
    res.status(400).json({error: "Couldnt start auth process"})
}

})

//validate the emailToken
//generate longlived jwt

router.post('/authenticate', async (req, res) => {

})
export default router;