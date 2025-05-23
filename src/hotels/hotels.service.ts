import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/location.service';

const Amadeus = require('amadeus');

@Injectable()
export class HotelsService {
  private amadeus;

  constructor(
    private readonly locationService: LocationService,
  ) {
    this.amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    });
  }

  async getHotelsInCity(city: string): Promise<any> {
    try {
        const cityCode = await this.locationService.getCityIATACode(city);

        const hotelsResponse = await this.amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode,
        });

        return hotelsResponse.data;
    } catch (error) {
        console.error('Error fetching hotels: ', error);
        throw error;
    }
    }
}
