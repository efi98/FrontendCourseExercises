import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { FlightsService } from "../services/flights.service";
import { DestinationsService } from "../services/destinations.service";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { Destination, Flight } from "../types";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, Subscription } from "rxjs";

@Component({
  selector: "app-user-book-flight",
  imports: [
    MatTableModule,
    RouterModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: "./user-book-flight.component.html",
  styleUrl: "./user-book-flight.component.scss",
})
export class UserBookFlightComponent implements OnInit, OnDestroy {
  flights_service = inject(FlightsService);

  filter_origin: string | null = null;
  filter_destination: string | null = null;
  destinations_service = inject(DestinationsService);
  displayedColumns: string[] = [
    "flight_id",
    "origin",
    "destination",
    "boarding_date",
    "boarding_time",
    "arrival_date",
    "arrival_time",
    "book",
  ];

  filtered_flights: Flight[] = [];
  all_flights: Flight[] = [];
  all_destinations: Destination[] = [];

  flightsSubscription!: Subscription;
  destinationsSubscription!: Subscription;
  ngOnInit(): void {
    this.flightsSubscription = this.flights_service.flights.subscribe((flights) => {
      this.all_flights = flights;
    });
    this.destinationsSubscription = this.destinations_service.destinationsData.subscribe(
      (destinations) => {
        this.all_destinations = destinations;
      }
    );
  }

  ngOnDestroy(): void {
    this.flightsSubscription.unsubscribe();
    this.destinationsSubscription.unsubscribe();
  }

  filterOrigin(origin: Destination) {
    this.filter_origin = origin.destination_name;
    this.filtered_flights = this.all_flights.filter(
      (f) =>
        f.origin == origin.destination_name &&
        (!this.filter_destination || f.destination == this.filter_destination)
    );
  }
  filterDestination(destination: Destination) {
    this.filter_destination = destination.destination_name;
    this.filtered_flights = this.all_flights.filter(
      (f) =>
        f.destination == destination.destination_name &&
        (!this.filter_origin || f.origin == this.filter_origin)
    );
  }
  showAll() {
    this.filter_origin = null;
    this.filter_destination = null;
    this.filtered_flights = [...this.all_flights];
  }
}
