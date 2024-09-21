import { Router } from 'express'
import { AppDataSource } from '../DataSource'
import { Role } from '../entity/Role'
import { authenticateJWT } from '../middleware/authMiddleware'

const router = Router()

router.use(authenticateJWT)

router.get('/', async (req, res) => {
  const roleRepository = AppDataSource.getRepository(Role)
  const roles = await roleRepository.find()
  res.json({
    data: roles
  })
})

export default router;