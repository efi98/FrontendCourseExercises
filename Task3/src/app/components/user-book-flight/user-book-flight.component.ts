import { Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { RouterModule } from "@angular/router";
import { FlightsService } from "../../services/flights.service";
import { DestinationsService } from "../../services/destinations.service";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatOptionModule } from "@angular/material/core";
import { Destination, Flight } from "@types";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { first, Subscription } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { isValidDate, strToBool } from "../../utilities/util";
import { DatePickerComponent } from "../date-picker/date-picker.component";

@Component({
    selector: "app-user-book-flight",
    imports: [
        MatButtonToggleModule,
        MatTableModule,
        RouterModule,
        MatIconModule,
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatOptionModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        DatePickerComponent,
    ],
    templateUrl: "./user-book-flight.component.html",
    styleUrl: "./user-book-flight.component.scss",
})
export class UserBookFlightComponent implements OnInit, OnDestroy {
    @ViewChild(DatePickerComponent) datePickerComponent!: DatePickerComponent;
    flights_service: FlightsService = inject(FlightsService);
    destinations_service: DestinationsService = inject(DestinationsService);

    filter_origin: Destination | null = null;
    filter_destination: Destination | null = null;
    filter_boarding_date: Date | null = null
    filter_lading_date: Date | null = null
    filter_passengers: number | null = null
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
    expandedMode: boolean = false;

    ngOnInit(): void {
        this.flightsSubscription = this.flights_service.flights.subscribe((flights) => {
            this.all_flights = flights;
            this.filtered_flights = [...flights]; // Initialize the table with all flights
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

    filterFlights(): void {
        this.filtered_flights = this.all_flights.filter((f) => {
            return (
                (!this.filter_origin || f.origin === this.filter_origin.destination_name) &&
                (!this.filter_destination || f.destination === this.filter_destination.destination_name) &&
                (!this.filter_passengers || f.numberOfPassengers >= this.filter_passengers)
            );
        });
    }

    filterPassengers(event: Event): void {
        const passnegers = (event.target as HTMLInputElement).value;
        this.filter_passengers = passnegers ? parseInt(passnegers) : null;
        this.filterFlights() // Reapply the filters
    }

    filterOrigin(origin: Destination): void {
        this.filter_origin = origin;
        this.filterFlights(); // Reapply the filters
    }

    filterDestination(destination: Destination): void {
        this.filter_destination = destination;
        this.filterFlights(); // Reapply the filters
    }

    showAll(): void {
        if (this.datePickerComponent) {
            this.datePickerComponent.resetForms();
        }
        this.filter_origin = null;
        this.filter_destination = null;
        this.filtered_flights = [...this.all_flights];
    }

    setModeVal(expandedModeTgl: any) {
        let value = expandedModeTgl.value;
        this.expandedMode = strToBool(value ?? '');
    }

    filterFlightsByDateRange(event: { start: Date; end: Date }) {
        if (!isValidDate(event.start) || !isValidDate(event.end)) {
            this.showAll();
            return;
        }
        this.flights_service.flightsByDate(event.start, event.end).pipe(first()).subscribe((data) => {
            this.filtered_flights = data;
        });
    }
}
