import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { item, fetchMenuItems } from '../controllers/addmenuitem.controller.js';

const menuItemRouter = Router();

menuItemRouter.post('/addMenuItem', protect, item);
menuItemRouter.get('/fetchMenuItems/:shopId', fetchMenuItems);

export default menuItemRouter;