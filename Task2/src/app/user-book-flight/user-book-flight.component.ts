import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FlightsService } from '../services/flights.service';
import { DestinationsService } from '../services/destinations.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Destination } from '../types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-book-flight',
  imports: [
    MatTableModule,
    RouterModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './user-book-flight.component.html',
  styleUrl: './user-book-flight.component.scss',
})
export class UserBookFlightComponent {
  flights_service = inject(FlightsService);

  filter_origin: string | null = null;
  filter_destination: string | null = null;
  destinations_service = inject(DestinationsService);
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

  filtered_flights = [...this.flights_service.flights];
  public get flights() {
    return this.flights_service.flights;
  }
  public get destinations() {
    return this.destinations_service.destinations;
  }

  filterOrigin(origin: Destination) {
    this.filter_origin = origin.destination_name;
    this.filtered_flights = this.flights_service.flights.filter(
      (f) =>
        f.origin == origin.destination_name &&
        (!this.filter_destination || f.destination == this.filter_destination)
    );
  }
  filterDestination(destination: Destination) {
    this.filter_destination = destination.destination_name;
    this.filtered_flights = this.flights_service.flights.filter(
      (f) =>
        f.destination == destination.destination_name &&
        (!this.filter_origin || f.origin == this.filter_origin)
    );
  }
  showAll() {
    this.filter_origin = null;
    this.filter_destination = null;
    this.filtered_flights = [...this.flights_service.flights];
  }
}
