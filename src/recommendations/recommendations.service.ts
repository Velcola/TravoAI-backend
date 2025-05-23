import { Injectable } from '@nestjs/common';
const Amadeus = require('amadeus');

@Injectable()
export class RecommendationsService {
    private amadeus;

    constructor() {
        this.amadeus = new Amadeus({
            clientId: process.env.AMADEUS_CLIENT_ID,
            clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        });
    } 

    async getFlightsToCity(originCity: string, destCity: string, startDate: string, endDate: string): Promise<any> {
        // Getting destination IATA code
        const destination = await this.getIATACode(destCity);
        const origin = await this.getIATACode(originCity);


        try {
            const response = await this.amadeus.shopping.flightOffersSearch.get({
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: startDate,
                returnDate: endDate,
                adults: 1,
                max: 5,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching flights:', error);
            throw error;
        }
    }

    private async getIATACode(city: string): Promise<string> {
        try {
            const response = await this.amadeus.referenceData.locations.get({
                keyword: city.trim(),
                subType: 'AIRPORT,CITY',
            });


            if (response.data.length === 0) {
                throw new Error('No IATA code found for city: ' + city);
            }

            return response.data[0].iataCode;
        } catch (error) {
            console.error('Error fetching IATA code:', error);
            throw error;
        }
    }
}
