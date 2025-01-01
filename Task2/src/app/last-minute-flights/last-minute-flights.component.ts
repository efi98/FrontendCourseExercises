import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FlightsService } from '../services/flights.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-last-minute-flights',
  imports: [CommonModule, MatCardModule, MatTableModule, RouterModule, MatIconModule],
  templateUrl: './last-minute-flights.component.html',
  styleUrl: './last-minute-flights.component.scss',
})
export class LastMinuteFlightsComponent {
  displayedColumns: string[] = [
    'flight_id',
    'origin',
    'destination',
    'boarding_date',
    'boarding_time',
    'arrival_date',
    'arrival_time',
    'book',
  ];
  flights_service = inject(FlightsService);

  public get flights() {
    return this.flights_service.flights;
  }
  public get last_minute_flights() {
    // show only those that are in the next 7 days
    return this.flights_service.flights.filter(
      (f) =>
        new Date(f.boarding_date) >= new Date() 
    );
  }
}
