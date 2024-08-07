import { Router } from "express";

const router= Router();

router.get('/', (req,res)=>{
    return res.send('Olá, DEV');
});

router.post('/', (req,res)=>{
    console.log(req.body);
    return res.json(req.body);
});


export {router};