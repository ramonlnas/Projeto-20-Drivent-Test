import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { Response } from 'express';
import { readSync } from 'fs';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = hotelsService.getHotels(Number(userId));
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const hotels = hotelsService.getHotelId(Number(userId), Number(hotelId));
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
