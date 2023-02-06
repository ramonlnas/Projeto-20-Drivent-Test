import app, { init } from '@/app';
import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  createTicketHotel,
  createTicketRemote,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 402 when is remote', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 404 when is no enroll', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const ticketType = await createTicketRemote();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and a empty array for no break on server', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await prisma.hotel.create({
        data: {
          name: 'Copacabana Pallace',
          image:
            'https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj7g8rGvIH9AhWj5VwKHTq_AHIYABAKGgJjZQ&ohost=www.google.com&cid=CAESbeD2yizi9Sb-W5t04g-39E-rU6qVCfpD0uum_AGglBBoOfWay5b7yHiKHVJtzybeUZ1vvrLxTcixqim7Kb9BmnaiyNoL8NsNpxGJyO7sJptrUEbcvWw1VbOHQ2CScAsnLncNNrYn0E1wgIJjmak&sig=AOD64_3LZZlXs0mCoTb16P64WU3rgjO43Q&q=&ved=2ahUKEwixx8PGvIH9AhXIqZUCHRnwBqUQh78CegQIBRAB&adurl=',
        },
      });
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString,
          updateAt: hotel.updatedAt.toISOString,
        },
      ]);
    });

    it('should respond with status 200 and get:hotels', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 402 when is remote', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 404 when is no enroll', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const ticketType = await createTicketRemote();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and a hotel', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await prisma.hotel.create({
        data: {
          name: 'Copacabana Pallace',
          image:
            'https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj7g8rGvIH9AhWj5VwKHTq_AHIYABAKGgJjZQ&ohost=www.google.com&cid=CAESbeD2yizi9Sb-W5t04g-39E-rU6qVCfpD0uum_AGglBBoOfWay5b7yHiKHVJtzybeUZ1vvrLxTcixqim7Kb9BmnaiyNoL8NsNpxGJyO7sJptrUEbcvWw1VbOHQ2CScAsnLncNNrYn0E1wgIJjmak&sig=AOD64_3LZZlXs0mCoTb16P64WU3rgjO43Q&q=&ved=2ahUKEwixx8PGvIH9AhXIqZUCHRnwBqUQh78CegQIBRAB&adurl=',
        },
      });

      const room = await prisma.room.create({
        data: {
          name: 'Cobertura',
          capacity: 3,
          hotelId: hotel.id,
        },
      });
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString,
        updateAt: hotel.updatedAt.toISOString,
        Rooms: [
          {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: hotel.id,
            createdAt: room.createdAt.toISOString,
            updateAt: room.updatedAt.toISOString,
          },
        ],
      });
    });
  });
});
