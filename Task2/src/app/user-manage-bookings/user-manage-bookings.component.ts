import { Component, inject } from '@angular/core';
import { BookingsService } from '../services/bookings.service';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-manage-bookings',
  imports: [MatTableModule, RouterModule, MatIconModule, RouterModule],
  templateUrl: './user-manage-bookings.component.html',
  styleUrl: './user-manage-bookings.component.scss',
})
export class UserManageBookingsComponent {
  bookings_service = inject(BookingsService);
  displayedColumns: string[] = ['destination_image', 'flight_details'];
  
  public get upcoming_bookings() {
    return this.bookings_service.bookings.filter(
      (b) => new Date(b.flight.boarding_date) >= new Date()
    );
  }
  public get past_bookings() {
    return this.bookings_service.bookings.filter(
      (b) => new Date(b.flight.boarding_date) < new Date()
    );
  }
}
