import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Destination, Flight } from "@types";
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
    @Input() displayFilters = true;
    @ViewChild(DatePickerComponent) datePickerComponent!: DatePickerComponent;
    private flightsService = inject(FlightsService);
    private destinationsService = inject(DestinationsService);
    private fb = inject(FormBuilder);

    flightsSubscription!: Subscription;
    destinationsSubscription!: Subscription;

    all_flights: Flight[] = [];
    filtered_flights: Flight[] = [];
    all_destinations: Destination[] = [];

    filterForm!: FormGroup;
    expandedMode: boolean = false;

    displayedColumns: string[] = [
        "flight_id",
        "origin",
        "destination",
        "boarding_date",
        "boarding_time",
        "arrival_date",
        "arrival_time",
        "price",
        "book",
    ];

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            origin: [null],
            destination: [null],
            startDate: [null],
            endDate: [null]
        });

        this.flightsSubscription = this.flightsService.flights.subscribe((flights) => {
            this.all_flights = flights;
            this.filtered_flights = [...flights]; // Initialize the table with all flights
        });

        this.destinationsSubscription = this.destinationsService.destinationsData.subscribe(
            (destinations) => {
                this.all_destinations = destinations;
            }
        );

        // Automatically filter when form changes
        this.filterForm.valueChanges.subscribe(() => this.filterFlights());
    }

    ngOnDestroy(): void {
        this.flightsSubscription.unsubscribe();
        this.destinationsSubscription.unsubscribe();
    }

    filterFlights(): void {
        const filters = {
            origin: this.filterForm.value.origin?.destination_name || null,
            destination: this.filterForm.value.destination?.destination_name || null,
            startDate: isValidDate(this.filterForm.value.startDate) ? this.filterForm.value.startDate : null,
            endDate: isValidDate(this.filterForm.value.endDate) ? this.filterForm.value.endDate : null
        };

        this.flightsService.flightsByFilters(filters)
            .pipe(first())
            .subscribe((data) => {
                this.filtered_flights = data;
            });
    }

    showAll(): void {
        if (this.datePickerComponent) {
            this.datePickerComponent.resetForms();
        }
        this.filterForm.reset();
        this.filtered_flights = [...this.all_flights];
    }

    setModeVal(expandedModeTgl: any) {
        this.expandedMode = strToBool(expandedModeTgl.value ?? '');
    }

    filterFlightsByDateRange(event: { start: Date; end: Date }) {
        this.filterForm.patchValue({
            startDate: event.start,
            endDate: event.end
        });
    }
}
