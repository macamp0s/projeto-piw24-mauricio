import { Router } from "express";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { AppDataSource } from "../DataSource";
import { User } from "../entity/User";

const router = Router()

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ username })

    if (user && bcrypt.compareSync(password, user.password)) {

        const token = jwt.sign({
            userId: user.id,
            userRole: user.role
        }, 'meu_segredo_mais_importante', { expiresIn: '1h' })

        res.status(200).json({
            data: {
                username: user.username,
                email: username.email,
                jwt: token
            }

        })
    } else {
        return res.status(401).json({
            status: 401,
            name: 'Authorization Error',
            message: 'Username or Password Invalid'
        })
    }

})

router.get('/logout', (req, res) => {

    res.status(200).json({
        data:{
            message:"Logout realized with sucess"
        }
    })
})

export default router