import { Injectable } from '@nestjs/common';

const Amadeus = require('amadeus');

@Injectable()
export class LocationService {
    private amadeus;

    constructor() {
        this.amadeus = new Amadeus({
            clientId: process.env.AMADEUS_CLIENT_ID,
            clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        });
    }
    async getCityIATACode(cityName: string): Promise<any> {
        try {
            const response = await this.amadeus.referenceData.locations.cities.get({
                keyword: cityName,
            });

            return response.data[0].iataCode;
        } catch (error) {
            console.error('Error fetching IATA code: ' + error);
            throw error;
        }
    }
}
