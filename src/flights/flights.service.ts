import { Injectable } from '@nestjs/common';
import { FlightOffer } from './flights.interface';

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
    ): Promise<FlightOffer[]>{
        try {
            const response = await this.amadeus.shopping.flightOffersSearch.get({
                originLocationCode: departureLocationCode,
                destinationLocationCode: arrivalLocationCode,
                departureDate: startDate,
                returnDate: endDate,
                adults: totalAdults,
                max: 5,
            });
            const filteredResponse: FlightOffer[] = response.data.map(offer => ({
                id: offer.id,
                numberOfBookableSeats: offer.numberOfBookableSeats,
                price: {
                    total: offer.price.total,
                    currency: offer.price.currency,
                },
                itineraries: offer.itineraries.map(itiernary => ({
                    duration: itiernary.duration,
                    segments: itiernary.segments.map(segment => ({
                        departure: {
                            iataCode: segment.departure.iataCode,
                            terminal: segment.departure.terminal || null,
                            at: segment.departure.at,
                        },
                        arrival: {
                            iataCode: segment.arrival.iataCode,
                            terminal: segment.arrival.terminal || null,
                            at: segment.arrival.at,
                        },
                        carrierCode: segment.carrierCode,
                        flightNumber: segment.number,
                        duration: segment.duration,
                        numberOfStops: segment.numberOfStops,
                    })),
                })),
            }));
            
            return filteredResponse;
        } catch (error) {
            console.error('Error fetching flights: ' + error);
            throw error;
        }
    }

    async getAirlineInfoByCode(
        airlineCode: string,
    ): Promise<any> {
        const response = await this.amadeus.referenceData.airlines.get({
            airlineCodes: airlineCode,
        });

        return response.data;
    }
}
