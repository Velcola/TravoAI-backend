export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal: string | null;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal: string | null;
    at: string;
  };
  carrierCode: string;
  flightNumber: string;
  duration: string;
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;
  numberOfBookableSeats: number;
  price: {
    total: string;
    currency: string;
  };
  itineraries: FlightItinerary[];
}