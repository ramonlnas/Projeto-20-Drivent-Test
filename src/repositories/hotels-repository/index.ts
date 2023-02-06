import { prisma } from "@/config";

async function getHotels() {
    const data = await prisma.hotel.findMany()
    return data
}

async function getRoomsHotelId(hotelId: number) {
    const data = await prisma.hotel.findFirst({
        where: {
            id: hotelId,
        },
        include: {
            Rooms: true
        }
    })
    return data
}

const hotelsRepository = {
    getHotels,
    getRoomsHotelId
}

export default hotelsRepository