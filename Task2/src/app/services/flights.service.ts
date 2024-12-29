import { Injectable } from '@angular/core';
import { Flight } from './types';
import { flightsData } from './flightsData';

@Injectable({
  providedIn: 'root'
})
export class FlightsService {
  
  private flightsData : Flight[] = [...flightsData]


  constructor() { }

  public get flights() {
    return this.flightsData
  }
}
