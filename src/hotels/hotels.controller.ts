import { Controller, Get, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
    constructor(
        private readonly hotelsService: HotelsService,
    ) {}

    @Get()
    async getHotels(
        @Query('city') cityName: string,
    ): Promise<any> {
        const hotels = await this.hotelsService.getHotelsInCity(
            cityName,
        );

        return hotels;
    }
}
