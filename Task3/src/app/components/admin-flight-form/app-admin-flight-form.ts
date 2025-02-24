import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { DestinationsService } from "../../services/destinations.service";
import { FlightsService } from "../../services/flights.service";
import { Destination, Flight } from "@types";
import { first, map, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatRadioModule } from "@angular/material/radio";
import { numOfSeatsPolicy, positiveNumberValidator } from "../../utilities/util";

@Component({
    selector: "app-admin-flight-form",
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
    ],
    templateUrl: "./admin-flight-form.component.html",
    styleUrl: "./admin-flight-form.component.scss",
})
export class AdminFlightFormComponent {
    flight?: Flight;
    flightForm!: FormGroup;
    destinations_service = inject(DestinationsService);
    flight_service = inject(FlightsService);
    all_flights: Flight[] = [];
    all_destinations: Destination[] = [];
    flights_subscription!: Subscription;
    destinations_subscription!: Subscription;
    isEditMode: boolean = false;
    protected readonly numOfSeatsPolicy = numOfSeatsPolicy;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.flightForm = this.formBuilder.group(
            {
                // destonation name has to be filled in
                origin: ["", Validators.required],
                destination: ["", Validators.required],
                boarding_date: ["", Validators.required],
                boarding_time: ["", Validators.required],
                arrival_date: ["", Validators.required],
                arrival_time: ["", Validators.required],
                price: [null, [Validators.required, positiveNumberValidator]],
                numberOfPassengers: ["", [Validators.required, Validators.min(numOfSeatsPolicy.min), Validators.max(numOfSeatsPolicy.max)]],
                status: [null, Validators.required]
            },
            {
                validators: [
                    this.dateLessThan("boarding_date", "arrival_date"),
                    this.dateNotInPast("boarding_date"),
                    this.dateNotInPast("arrival_date"),
                ],
            }
        );
    }

    ngOnDestroy(): void {
        this.flights_subscription.unsubscribe();
        this.destinations_subscription.unsubscribe();
    }

    ngOnInit(): void {
        let flights_Observable = this.flight_service.flights.pipe(first(), map((flights) => {
            this.all_flights = flights;
        }));

        this.destinations_subscription = this.destinations_service.destinationsData.subscribe(
            (destinations) => {
                this.all_destinations = destinations;
            }
        );

        this.flights_subscription = flights_Observable.subscribe({
            next: (next) => {
                console.log('loaded!');
            },
            error: err => {
                console.log(err);
            },
            complete: () => {
                const flightId = this.route.snapshot.paramMap.get("flight_id");
                if (flightId) {
                    this.isEditMode = true;
                    this.loadFlight(flightId);
                }
            }
        });
    }

    loadFlight(flightId: string) {
        const flight = this.all_flights.find((f) => f.flight_id == flightId);
        if (!flight) {
            alert("Flight not found.");
            this.router.navigate(["/admin-manage-flights"]);
            return;
        }
        this.flight = flight;
        this.flightForm.patchValue(this.flight);
    }

    // Validator to ensure a date is not in the past
    dateNotInPast(controlName: string) {
        return (formGroup: AbstractControl) => {
            const controlValue = formGroup.get(controlName)?.value;
            if (controlValue && new Date(controlValue) < new Date()) {
                formGroup.get(controlName)?.setErrors({pastDate: true});
            } else if (controlValue === '') {
                formGroup.get(controlName)?.setErrors({required: true});
            } else {
                formGroup.get(controlName)?.setErrors(null);
            }
        };
    }

    // Validator to ensure boarding date is before arrival date
    dateLessThan(startDate: string, endDate: string) {
        return (formGroup: AbstractControl) => {
            const start = formGroup.get(startDate)?.value;
            const end = formGroup.get(endDate)?.value;
            if (start && end && new Date(start) > new Date(end)) {
                formGroup.get(endDate)?.setErrors({dateMismatch: true});
            } else {
                formGroup.get(endDate)?.setErrors(null);
            }
        };
    }

    submitForm() {
        if (this.flightForm.valid) {
            // todo - use 'dateMismatch' instead (then the form is invalid)
            // check boarding date is before arrival date
            if (
                new Date(this.flightForm.value.boarding_date) > new Date(this.flightForm.value.arrival_date)
            ) {
                alert("Boarding date must be before arrival date!");
                return;
            }
            // check that origin and destination are different
            if (this.flightForm.value.origin === this.flightForm.value.destination) {
                alert("Origin and destination must be different!");
                return;
            }

            const destination = this.all_destinations.find(
                (d) => d.destination_name === this.flightForm.value.destination
            );

            const flightData = {
                ...this.flightForm.value,
                flight_id: this.flight?.flight_id,
                image_url: destination?.image_url,
                link: destination?.airport_url,
                airportName: destination?.airport_name,
                airportWebsite: destination?.airport_url,
            };

            if (this.isEditMode) {
                this.flight_service.editFlight(flightData);
                alert("Flight changes saved successfully!");
            } else {
                this.flight_service.addFlight(flightData);
                alert("Flight added successfully!");
            }

            this.router.navigate(["/admin-manage-flights"]);
        } else {
            // Mark all fields as touched to show validation messages
            this.flightForm.markAllAsTouched();
            alert("Please fill in all required fields before submitting.");
        }
    }
}
