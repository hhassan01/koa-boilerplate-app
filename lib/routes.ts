import Router from 'koa-router';

import discovery from './api/discovery';
import health from './api/health';
import IssuesHandler from './api/issues';

const router = new Router();

router.get('/', discovery);
router.get('/health', health);

router.get('/issues', IssuesHandler.getAll);
router.get('/issues/:id', IssuesHandler.get);
router.post('/issues', IssuesHandler.create);
router.put('/issues/:id', IssuesHandler.update);

export default router;
