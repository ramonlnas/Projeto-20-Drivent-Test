import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelId } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getHotels);
hotelsRouter.get('/:hotelId', authenticateToken, getHotelId);

export { hotelsRouter };
