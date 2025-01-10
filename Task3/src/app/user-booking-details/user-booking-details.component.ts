import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BookingsService } from "../services/bookings.service";
import { Booking } from "../types";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { Subscription } from "rxjs";
@Component({
  selector: "app-user-booking-details",
  imports: [CommonModule, MatCardModule],
  templateUrl: "./user-booking-details.component.html",
  styleUrl: "./user-booking-details.component.scss",
})
export class UserBookingDetailsComponent implements OnInit, OnDestroy {
  booking?: Booking;

  bookings_service = inject(BookingsService);
  bookings_subscription!: Subscription;
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get("booking_id"); // Retrieve the parameter
    if (!code) {
      alert("Invalid Booking id provided.");
      this.router.navigate(["/user-manage-bookings"]); // If no code is provided, redirect to the destinations page
      return;
    }
    this.bookings_subscription = this.bookings_service.bookings.subscribe((bookings) => {
      const dest = bookings.find((d) => d.booking_id == code); // Find the destination with the matching code
      if (!dest) {
        alert("Booking not found.");
        this.router.navigate(["/user-manage-bookings"]); // If no destination is found, redirect to the destinations page
        return;
      }
      this.booking = dest;
      this.bookings_subscription.unsubscribe();
    });
  }
}
