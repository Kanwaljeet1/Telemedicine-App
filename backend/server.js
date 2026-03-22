import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
/*import User from './model/User.js';
*/

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.post('/users', async(req,res)=>{

    try {
        const user =await
        user.create(req.body);
        res.status(201).json(user);

    }catch(err){
        res.status(500).json({
            error: err.message
        });

    }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, ()=>{
    console.log('SERVER is running on the port ${PORT}');
});