import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { item, fetchMenuItems, searchMenuItems } from '../controllers/menuitem.controller.js';

const menuItemRouter = Router();

menuItemRouter.post('/addMenuItem', protect, item);
menuItemRouter.get('/fetchMenuItems/:shopId', fetchMenuItems);
menuItemRouter.get('/search', searchMenuItems);

export default menuItemRouter;