import { notFoundError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelsRepository from "@/repositories/hotels-repository"
import ticketRepository from "@/repositories/ticket-repository"

async function getHotels(userId: number) {
    const enroll = enrollmentRepository.findWithAddressByUserId(userId)

    if(!enroll) {
        throw notFoundError()
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId((await enroll).id)

    if(!ticket || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === "RESERVED") {
        throw notFoundError()
    }

    const hotels = await hotelsRepository.getHotels()
    return hotels
}

async function getHotelId(userId: number, hotelId: number) {
    const enroll = enrollmentRepository.findWithAddressByUserId(userId)

    if(!enroll) {
        throw notFoundError()
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId((await enroll).id)

    if(!ticket || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === "RESERVED") {
        throw notFoundError()
    }

    const hotels = await hotelsRepository.getRoomsHotelId(hotelId)
    return hotels
}


const hotelsService = {
    getHotels,
    getHotelId
}

export default hotelsService