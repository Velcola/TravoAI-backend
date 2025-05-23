import { Injectable } from '@nestjs/common';

const Amadeus = require('amadeus');

@Injectable()
export class FlightsService {
    private amadeus;

    constructor() {
        this.amadeus = new Amadeus({
            clientId: process.env.AMADEUS_CLIENT_ID,
            clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        });
    }

    // TODO: Make it better by requiring amount of children / infants, baggage, max price, etc.
    async getFlights(
        departureLocationCode: string,
        arrivalLocationCode: string,
        startDate: string,
        endDate: string,
        totalAdults: number,
    ): Promise<any>{
        try {
            const response = await this.amadeus.shopping.flightOffersSearch.get({
                originLocationCode: departureLocationCode,
                destinationLocationCode: arrivalLocationCode,
                departureDate: startDate,
                returnDate: endDate,
                adults: totalAdults,
                max: 5,
            });
            
            // TODO: Return only necessary data to clean up response
            return response.data;
        } catch (error) {
            console.error('Error fetching flights: ' + error);
            throw error;
        }
    }
}
