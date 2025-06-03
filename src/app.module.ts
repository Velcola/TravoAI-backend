import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RecommendationsController } from './recommendations/recommendations.controller';
import { FlightsController } from './flights/flights.controller';
import { HotelsController } from './hotels/hotels.controller';
import { RecommendationsService } from './recommendations/recommendations.service';
import { ConfigModule } from '@nestjs/config';
import { FlightsService } from './flights/flights.service';
import { OpenAIService } from './openai/openai.service';
import { HotelsService } from './hotels/hotels.service';
import { LocationService } from './location/location.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available globally
    }),
  ],
  controllers: [
    RecommendationsController,
    FlightsController,
    HotelsController,
  ],
  providers: [AppService, RecommendationsService, FlightsService, OpenAIService, HotelsService, LocationService],
})
export class AppModule {}
