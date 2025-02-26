import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BookingsService } from "../../services/bookings.service";
import { Booking, Passenger } from "@types";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { luggageWeights } from "../../utilities/util";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-user-booking-details",
    imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
    templateUrl: "./user-booking-details.component.html",
    styleUrl: "./user-booking-details.component.scss"
})
export class UserBookingDetailsComponent implements OnInit, OnDestroy {
    booking?: Booking;
    bookings_service = inject(BookingsService);

    private bookings_subscription!: Subscription;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const bookingId = params.get("booking_id");
            if (!bookingId) {
                alert("Invalid Booking ID provided.");
                this.router.navigate(["/user-manage-bookings"]);
                return;
            }

            this.fetchBookingDetails(bookingId);
        });
    }

    fetchBookingDetails(bookingId: string): void {
        this.bookings_subscription = this.bookings_service.bookingsData
            .pipe(take(1)) // Automatically unsubscribe after the first value is emitted
            .subscribe((bookings) => {
                const booking = bookings.find((b) => b.booking_id === bookingId);
                if (!booking) {
                    alert("Booking not found.");
                    this.router.navigate(["/user-manage-bookings"]);
                    return;
                }
                this.booking = booking;
            });
    }

    getLuggage(passenger: Passenger): string[] {
        const luggage = passenger.Luggage;
        const luggageDetails: string[] = [];
        if (!luggage) {
            return [];
        }

        if (luggage.cabin > 0) {
            luggageDetails.push(`${luggage.cabin}x ${luggageWeights.cabin}kg`);
        }
        if (luggage.checked > 0) {
            luggageDetails.push(`${luggage.checked}x ${luggageWeights.checked}kg`);
        }
        if (luggage.heavy > 0) {
            luggageDetails.push(`${luggage.heavy}x ${luggageWeights.heavy}kg`);
        }

        return luggageDetails;
    }

    ngOnDestroy(): void {
        if (this.bookings_subscription) {
            this.bookings_subscription.unsubscribe();
        }
    }
}
