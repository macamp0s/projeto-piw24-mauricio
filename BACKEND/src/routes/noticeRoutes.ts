import { Router } from 'express'
import { AppDataSource } from '../DataSource'
import { User } from '../entity/User'
import { Role } from '../entity/Role'
import { Subject } from '../entity/Subject'
import { Notice } from '../entity/Notice'
import { authenticateJWT } from '../middleware/authMiddleware'
import bcrypt from 'bcryptjs'

const router = Router()

router.post('/:subjectId/notices', async (req, res) => {
    const { subjectId } = req.params;
    const { title, content } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({
        error: {
          status: 400,
          name: 'Validation error',
          message: 'You missed a required field (title or content)'
        }
      });
    }
  
    const subjectRepository = AppDataSource.getRepository(Subject);
    const noticeRepository = AppDataSource.getRepository(Notice);
  
    const subject = await subjectRepository.findOne({ where: { id: Number(subjectId) } });
  
    if (!subject) {
      return res.status(404).json({
        error: {
          name: 'NotFound',
          message: 'Subject not found'
        }
      });
    }
  
    const newNotice = noticeRepository.create({
      title,
      content,
      subject
    });
  
    await noticeRepository.save(newNotice);
  
    res.status(200).json({
      data: newNotice
    });
  });

  export default router
  