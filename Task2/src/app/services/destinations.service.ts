import { Injectable } from '@angular/core';
import { flightsData } from '../flightsData';
import { Destination, Flight } from '../types';

let codes = 0;
function toDestination(flight: Flight): Destination {
  return {
    destination_code: codes++,
    destination_name: flight.destination,
    airport_name: flight.airportName,
    airport_url: flight.airportWebsite,
    image_url: flight.image_url,
  };
}

function toFirstFlight(destination: string) {
  return flightsData.find((f) => f.destination === destination)!;
}
@Injectable({
  providedIn: 'root',
})
export class DestinationsService {
  private destinationsData: Destination[] = [
    ...new Set(
      flightsData.map((flight: Flight) => flight.destination).map(toFirstFlight)
    ),
  ].map(toDestination);

  constructor() {}

  public get destinations() {
    return this.destinationsData;
  }

  public addDestination(destination: Destination) {
    this.destinationsData.push(destination);
  }
}
