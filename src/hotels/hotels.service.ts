import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/location.service';
import { HotelOffer } from './hotels.interface';

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

  async getHotelsInCity(
    city: string
  ): Promise<HotelOffer[]> {
    try {
        const cityCode = await this.locationService.getCityIATACode(city);

        const response = await this.amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode,
        });
        const filteredResponse = response.data.map(hotels => ({
          hotelName: hotels.name,
          hotelId: hotels.hotelId,
        }));

        return filteredResponse.slice(0, 10);
    } catch (error) {
        console.error('Error fetching hotels: ', error);
        throw error;
    }
  }
}
