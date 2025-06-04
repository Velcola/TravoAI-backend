import { Controller, Get, Query } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { HotelsService } from 'src/hotels/hotels.service';
import { FlightsService } from 'src/flights/flights.service';
import { LocationService } from 'src/location/location.service';
import { start } from 'repl';

@Controller('recommendations')
export class RecommendationsController {
    constructor(
        private readonly flightsService: FlightsService,
        private readonly openaiService: OpenAIService,
        private readonly hotelsService: HotelsService,
        private readonly locationService: LocationService,
    ) {}

    //TODO?: Budget
    @Get()
    async getRecommendations(
        @Query('departureLocation') departureLocation: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('adults') totalAdults: number,
        @Query('travelMonth') travelMonth: string,                          // for seasonal suitability
        @Query('interests') rawInterests: string,                            // array of comma-seperated strings ("beaches", "history", "food")
        @Query('tripLength') tripLength: number,                            // e.g 7 days
        @Query('travelStyle') travelStyle: string,                          // for example: "relaxing", "romantic", "adventure"
        @Query('temperaturePreference') temperaturePreference: string       // "warm", "cool", "mild"
    ): Promise<any> {
        const interests = rawInterests.split(',').map(i => i.trim());
        
        // STEP 1: Get an AI destination recommendation
        const recommendedDestination: string = await this.openaiService.generateRecommendedDestination(
            departureLocation,
            interests,
            travelMonth,
            tripLength,
            travelStyle,
            temperaturePreference,
        )

        // STEP 2: Give a Captain Travo response to why they should travel to the destination
        const travelReason: string = await this.openaiService.generateCaptainTravelReason(
            recommendedDestination,
            interests,
            travelMonth,
            tripLength,
            travelStyle,
            temperaturePreference,
        );

        // STEP 3: Show different flights to the recommended location
        const flights: any = await this.flightsService.getFlights(
            await this.locationService.getCityIATACode(departureLocation),
            await this.locationService.getCityIATACode(recommendedDestination.split(',')[0]),

            startDate,
            endDate,
            totalAdults,
        )

        // STEP 4: Show different hotels at the destination
        // No longer broken because of Amadeus!! NEVER TOUCH THIS. IT WORKS.
        const hotels: any = await this.hotelsService.getHotelsInCity(recommendedDestination.split(',')[0]);

        return {
            recommendedDestination,
            travelReason,
            hotels,
            flights,
        }
    }
}
