import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/user',userRoutes);
app.use('/tweet',tweetRoutes);
app.use('/auth', authRoutes);

app.get('/', (req,res)=>{
    res.send('Hello word');
});

app.listen(3000, ()=>{
    console.log("Server ready at 3000");
})