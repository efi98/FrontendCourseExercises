import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Flight } from "@types";
import { FlightsService } from "../../services/flights.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BookingsService } from "../../services/bookings.service";
import { debounceTime, Subscription } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from "@angular/material/dialog";
import { DialogChooseLuggageComponent } from "../dialog-choose-luggage/dialog-choose-luggage.component";
import { luggageWeights } from "../../utilities/util";
import { CouponsService } from "../../services/coupons.service";

@Component({
    selector: "app-user-book-flight-form",
    imports: [
        MatButtonModule,
        MatStepperModule,
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatCardModule, MatChipsModule, MatProgressBarModule
    ],
    templateUrl: "./user-book-flight-form.component.html",
    styleUrl: "./user-book-flight-form.component.scss",
})
export class UserBookFlightFormComponent implements OnInit, OnDestroy {
    flight!: Flight;
    //
    bookings_service = inject(BookingsService);
    flight_service = inject(FlightsService);
    couponService = inject(CouponsService);
    flight_subscription!: Subscription;
    //
    bookings_subscription!: Subscription;
    all_flights: Flight[] = [];
    bookingForm!: FormGroup;
    couponPercentage = 0;
    readonly dialog = inject(MatDialog);
    private _formBuilder = inject(FormBuilder);

    constructor(private route: ActivatedRoute, private router: Router) {
        this.initForm();
    }

    get passAmount() {
        return this.bookingForm.get('passAmount') as FormGroup;
    }

    get passDetails() {
        return this.bookingForm.get('passDetails') as FormArray;
    }

    get codeCoupon() {
        return this.bookingForm.get('codeCoupon') as FormControl;
    }

    hasLuggage(index: number): boolean {
        const luggage = this.passDetails.at(index).get('Luggage')?.value;
        return luggage.cabin > 0 || luggage.checked > 0 || luggage.heavy > 0;
    }

    getTotalLuggage(index: number): number {
        const luggage = this.passDetails.at(index).get('Luggage')?.value;
        return (luggage.cabin || 0) + (luggage.checked || 0) + (luggage.heavy || 0);
    }

    getTotalLuggageWeight(index: number): number {
        const luggage = this.passDetails.at(index).get('Luggage')?.value;
        return (luggage.cabin || 0) * luggageWeights.cabin +
            (luggage.checked || 0) * luggageWeights.checked +
            (luggage.heavy || 0) * luggageWeights.heavy;
    }

    getLuggageDetails(index: number): string[] {
        const luggage = this.passDetails.at(index).get('Luggage')?.value;
        const luggageDetails: string[] = [];

        // Check for each luggage type and add chips if greater than 0
        if (luggage.cabin > 0) luggageDetails.push(`${luggage.cabin}x ${luggageWeights.cabin}kg`);
        if (luggage.checked > 0) luggageDetails.push(`${luggage.checked}x ${luggageWeights.checked}kg`);
        if (luggage.heavy > 0) luggageDetails.push(`${luggage.heavy}x ${luggageWeights.heavy}kg`);
        return luggageDetails;
    }

    initForm(): void {
        this.bookingForm = this._formBuilder.group({
            passAmount: this._formBuilder.group({
                amount: [1, Validators.required]
            }),
            passDetails: this._formBuilder.array([]),
            codeCoupon: [null, [], [this.couponService.couponAsyncValidator()]]
        });

        this.updatePassengerArray(this.bookingForm.get('passAmount')?.value.amount || 1);

        this.bookingForm.get('passAmount')!.valueChanges.pipe(debounceTime(300)).subscribe(value => {
            this.updatePassengerArray(value.amount);
        });
    }

    createPassengerForm(): FormGroup {
        return this._formBuilder.group({
            full_name: [null, Validators.required],
            passport_number: [null, Validators.required],
            Luggage: this._formBuilder.group({
                cabin: [0, Validators.required],
                checked: [0, Validators.required],
                heavy: [0, Validators.required],
            })
        });
    }

    updatePassengerArray(newCount: number): void {
        const passDetails = this.bookingForm.get('passDetails') as FormArray;

        while (passDetails.length < newCount) passDetails.push(this.createPassengerForm());
        while (passDetails.length > newCount) passDetails.removeAt(passDetails.length - 1);
    }

    ngOnDestroy(): void {
        this.flight_subscription?.unsubscribe();
        this.bookings_subscription?.unsubscribe()
    }

    ngOnInit() {
        const code = this.route.snapshot.paramMap.get("flight_id"); // Retrieve the parameter
        if (!code) { //todo: unreachable code
            alert("Invalid flight id provided.");
            this.router.navigate(["/admin-manage-flights"]); // If no code is provided, redirect to the destinations page
            return;
        }
        this.flight_subscription = this.flight_service.flights.subscribe((flights) => {
            this.all_flights = flights;
            const dest = flights.find((d) => d.flight_id == code); // Find the destination with the matching code
            if (!dest) {
                alert("Destination not found.");
                this.router.navigate(["/admin-manage-destinations"]); // If no destination is found, redirect to the destinations page
                return;
            }
            this.flight = dest;
        });

        this.codeCoupon.valueChanges.pipe(debounceTime(300)).subscribe(value => {
            this.onCouponChange(value);
        })
    }

    async bookFlight() {
        const allPassengersValid = this.passDetails.controls.every((passGroup) => {
            const fullName = passGroup.get('full_name')?.value;
            const passportNumber = passGroup.get('passport_number')?.value;
            return fullName && passportNumber;
        });

        if (!allPassengersValid) {
            alert("Please fill in all passenger details.");
            return;
        }

        const passengers = this.passDetails.controls.map((passGroup) => ({
            full_name: passGroup.get('full_name')?.value,
            passport_number: passGroup.get('passport_number')?.value,
            Luggage: passGroup.get('Luggage')?.value,
        }));

        await this.bookings_service.addBooking({
            booking_id: "", // The booking_id will be generated by Firebase
            flight: this.flight!,
            passengers,
            codeCoupon: this.codeCoupon.value || null,
            totalPrice: this.getFlightPrice()
        });

        await this.couponService.updateCouponUsage(this.codeCoupon.value);

        alert("Flight booked successfully!");
        window.location.reload();
        window.location.href = "/user-book-flight";
    }


    openChooseLuggageDialog(index: number) {
        const passengerLuggage = this.passDetails.at(index)?.get('Luggage')?.value || {cabin: 0, checked: 0, heavy: 0};

        const dialogRef = this.dialog.open(DialogChooseLuggageComponent, {
            data: {
                name: this.passDetails.at(index)?.get('full_name')?.value,
                luggage: {...passengerLuggage}
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.passDetails.at(index)?.get('Luggage')?.setValue(result);
            }
        });
    }

    onCouponChange(codeCoupon: any): void {
        const isValid = this.bookingForm.get("codeCoupon")?.valid;
        if (!codeCoupon || !isValid) return;

        this.couponService.validateCoupon(codeCoupon).then((result) => {
            if (result.error) {
                this.couponPercentage = 0;
                console.error(result.error);
            } else if (result.coupon) {
                this.couponPercentage = result.coupon.discountPercentage;
            }
        });
    }

    getFlightPrice(): number {
        const basePrice = this.flight.price * this.passAmount.get('amount')?.value;
        if (this.codeCoupon.value) {
            return basePrice * (this.couponPercentage / 100);
        }
        return basePrice;
    }
}
