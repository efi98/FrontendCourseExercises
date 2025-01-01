import { Injectable } from '@angular/core';
import { Flight } from '../types';
import { flightsData } from '../flightsData';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  private flightsData: Flight[] = [...flightsData];

  constructor() {}

  addFlight(flight: Flight) {
    this.flightsData.push(flight);
  }
  public get flights() {
    return this.flightsData;
  }
}
