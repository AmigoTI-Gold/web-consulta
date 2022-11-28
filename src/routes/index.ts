import { Router } from 'express';

import specialistRoutes from './specialists.routes';
import appointmentsRoutes from './appointments.routes';
import patientsRoutes from './patients.routes';
import sessionsRouter from './sessions.routes';
import triageRouter from './triages.routes';
import clinicalProcessRouter from './clinicalProcess.routes';
import examRouter from './exams.routes';
import documentsRouter from './documents.routes';

const router = Router();

router.use('/triages', triageRouter);
router.use('/sessions', sessionsRouter);
router.use('/patients', patientsRoutes);
router.use('/specialists', specialistRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/clinicalProcess', clinicalProcessRouter);
router.use('/exams', examRouter);
router.use('/documents', documentsRouter);

export default router;
