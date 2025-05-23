import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
    constructor(
        private readonly flightsService: FlightsService,
    ) {}

    // TODO: Make it better by requiring amount of children / infants, baggage, max price, etc.
    @Get()
    async getFlights(
        @Query('departureAirport') departureAirport: string,
        @Query('arrivalAirport') arrivalAirport: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('adults') totalAdults: number,
    ): Promise<any> {
        const flights = this.flightsService.getFlights(
            departureAirport,
            arrivalAirport,
            startDate,
            endDate,
            totalAdults
        )

        return flights;
    }
}
