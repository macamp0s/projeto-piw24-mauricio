import { Router } from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from "../DataSource"
import { User } from "../entity/User"

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({
    where: {
      username: username
    }, 
    relations: ['role']
  })
  if(user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({
      userId: user.id,
      userRole: user.role
    }, 'meu_segredo_mais_importante', { expiresIn: '1h'})

    res.status(200).json({ data: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: username.email,
        role: {
          id: user.role.id,
          name: user.role.name
        }
      },
      jwt: token
    }})
  } else {
    return res.status(401).json({
      status: 401,
      name: 'Authorization Error',
      message: 'Username or Password invalid'
    })
  }
})

router.get('/logout', (req, res) => {
  res.status(200).json({
    data: {
      message: "Logout realized with sucess"
    }
  })
})

export default router