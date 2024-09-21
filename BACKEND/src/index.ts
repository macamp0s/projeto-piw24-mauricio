import express from 'express'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import roleRoutes from './routes/roleRoutes'
import subjectRoutes from './routes/subjectRoutes'
import noticeRoutes from './routes/noticeRoutes'
import cors from "cors";
import { AppDataSource } from './DataSource'

async function startServer() {
  try {
    await AppDataSource.initialize()
    
    const app = express()
    const port  = 3000

    app.use(cors())
    
    app.use(express.json())
    app.use('/', authRoutes)
    app.use('/users', userRoutes)
    app.use('/roles', roleRoutes)
    app.use('/subjects', subjectRoutes)
    app.use('/notices', noticeRoutes)
    
    
    app.listen(port, () => {
      console.log(`Servidor escutando a port ${port} em http://localhost:${port}`)
    })
  } catch(e) {
    throw e
  }
}

startServer()
