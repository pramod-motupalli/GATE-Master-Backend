// routes/subjects.js

import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import { getSubjects } from '../controllers/subjectController.js';
import paperRoutes from './papers.js';

const router = Router();

// GET /api/subjects/ → list all subjects (requires auth)
router.get('/', auth, getSubjects);

// Nested routes for papers under a given subject:
// e.g. GET /api/subjects/:subjectId/papers/
//      GET /api/subjects/:subjectId/papers/:paperId
//      POST /api/subjects/:subjectId/papers/:paperId/submit
router.use('/:subjectId/papers', auth, paperRoutes);

export default router;
