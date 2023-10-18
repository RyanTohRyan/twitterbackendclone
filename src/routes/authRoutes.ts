import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from 'jsonwebtoken';

const EMAIL_TOKEN_EXPIRATION_IN_MINUTES = 10;
const AUTH_EXPIRE_HOURS =12;
const JWT_SECRET = "SUPER SECRET"

const router = Router();
const prisma = new PrismaClient();

function generateEmailToken(): string {
    return Math.floor(10000000 + Math.random()*9000000).toString();
}

function generateAuthToken(tokenId:number): string {
    const jwtPayload = {tokenId}

    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
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
    const {email, emailToken} = req.body;


    const dbEmailToken = await prisma.token.findUnique({
        where: {emailToken},
        include: {
            user: true
        }
    })

    if (!dbEmailToken || !dbEmailToken.valid){
        return res.sendStatus(401)
    }
    if (dbEmailToken.expiration < new Date()){
            return res.sendStatus(401).json({error: "token expireddd"})
        }

    if (dbEmailToken?.user?.email !== email){
        return res.sendStatus(401)
    }

    //here we vaildated user owns the email, so gen api token
    const expiration = new Date(
        new Date().getTime() + AUTH_EXPIRE_HOURS * 60 * 60 *1000
    );

    const apiToken = await prisma.token.create({
        data: { 
            type: "API",
            expiration,
            user: {
                connect: {
                    email,
                }
            }
        }
    });

    //aft make jwt, invalidate email token

    await prisma.token.update({
        where: {id: dbEmailToken.id},
        data: {valid: false}
    })

    //make jwt

    const authToken = generateAuthToken(apiToken.id);
 res.json({authToken})
})
export default router;