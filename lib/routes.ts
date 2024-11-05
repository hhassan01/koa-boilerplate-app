import Router from 'koa-router';

import discovery from './api/discovery';
import health from './api/health';
import Issues from './api/issues';

const router = new Router();

router.get('/', discovery);
router.get('/health', health);

router.get('/issues', Issues.getAll);
router.get('/issues/:id', Issues.get);
router.post('/issues', Issues.create);
router.put('/issues/:id', Issues.update);

export default router;
