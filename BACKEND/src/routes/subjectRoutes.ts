import { Router } from 'express'
import { AppDataSource } from '../DataSource'
import { User } from '../entity/User'
import { Subject } from '../entity/Subject'
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware'

const router = Router()

router.use(authenticateJWT)

router.post('/', authorizeAdmin, async (req, res) => {
    const { subjectName } = req.body
  
    if (!subjectName) {
      return res.status(400).json({
        error: {
          status: 400,
          name: 'Validation error',
          message: 'You missed a required field'
        }
      })
    }
  
    const classRepository = AppDataSource.getRepository(Subject)
  
    const newSubject: Subject = classRepository.create({
        subjectName
    })
  
    await classRepository.save(newSubject)
    res.status(200).json({
      data: newSubject
    })
  })

  router.get('/', async (req, res) => {
    try {
    
      const subjectRepository = AppDataSource.getRepository(Subject);
    
     
      const subjects = await subjectRepository.find({
        relations: ['students', 'notices'],  
      });
    
   
      res.json({
        data: subjects,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error fetching subjects",
      });
    }
  });
  
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({
        error: {
          name: 'Invalid Id',
          message: 'The id must be  number'
        }
      })
    }
  
    const subjectRepository = AppDataSource.getRepository(Subject)
    const subjects = await subjectRepository.findOne({
      where: {
        id: id
      },
      relations: ['students']
    })
  
    if (!subjects) {
      return res.status(404).json({
        error: {
          name: 'NotFound',
          message: 'Class not found'
        }
      })
    }
  
    res.json({
      data: subjects
    })
  })

router.delete('/:id', authorizeAdmin, async (req, res) => {
    const id  = Number(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({
        error: {
          name: 'Invalid Id',
          message: 'The id must be  number'
        }
      })
    }
    const subjectRepository = AppDataSource.getRepository(Subject);
  const subjects = await subjectRepository.findOne({
    where: {
      id: id
    }, 
    relations: ['students']
  })

  if(!subjects) {
    return res.status(404).json({
      error: {
        name: 'NotFound',
        message: 'Class not found'
      }
    })
  }

  subjectRepository.remove(subjects)
  res.status(200).json({
    data: subjects
  })
})

router.put('/:id',authorizeAdmin, async (req, res) => {
  const id = Number(req.params.id);

  
  if (isNaN(id)) {
    return res.status(400).json({
      error: {
        name: 'Invalid Id',
        message: 'The id must be a number',
      },
    });
  }

  
  const { subjectName } = req.body;

  
  if (!subjectName) {
    return res.status(400).json({
      error: {
        status: 400,
        name: 'Validation error',
        message: 'You missed a required field',
      },
    });
  }

  const subjectRepository = AppDataSource.getRepository(Subject);

  try {
   
    const subject = await subjectRepository.findOne({
      where: {
        id: id,
      },
    });

   
    if (!subject) {
      return res.status(404).json({
        error: {
          name: 'NotFound',
          message: 'Subject not found',
        },
      });
    }

    subject.subjectName = subjectName;

    await subjectRepository.save(subject);

    res.status(200).json({
      data: subject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        name: 'ServerError',
        message: 'Error updating subject',
      },
    });
  }
});


router.post('/:classId/students', authorizeAdmin, async (req, res) => {
  try {
    const { classId } = req.params;
    const { userIds } = req.body; 

    const userRepository = AppDataSource.getRepository(User);
    const classRepository = AppDataSource.getRepository(Subject);

    const subjectEntity = await classRepository.findOne({
      where: { id: parseInt(classId) },
    });

    if (!subjectEntity) {
      return res.status(404).json({ message: 'Class not found' });
    }

    for (const userId of userIds) {
      const user = await userRepository.findOne({
        where: { id: parseInt(userId) },
        relations: ['subject'],
      });

      if (!user) {
        return res.status(404).json({ message: `User with ID ${userId} not found` });
      }

      if (!user.subject.some(cls => cls.id === subjectEntity.id)) {
        user.subject.push(subjectEntity);
        await userRepository.save(user);
      }
    }

    res.status(200).json({ message: 'Students added to class successfully!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error adding students to class' });
  }
});

  export default router;