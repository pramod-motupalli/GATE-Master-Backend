import { Router } from 'express';
import { getPapersBySubject, getPaper } from '../controllers/paperController.js';
import { submitResult, getResult } from '../controllers/resultController.js';

const router = Router({ mergeParams: true });
router.get('/', getPapersBySubject);
router.get('/:paperId', getPaper);
router.post('/:paperId/submit', submitResult);
router.get('/result/:resultId', getResult);

export default router;
