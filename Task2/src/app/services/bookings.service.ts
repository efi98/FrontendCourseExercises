import { Injectable } from '@angular/core';
import { Booking } from '../types';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  bookings: Booking[] = [];
  constructor() {}

  addBooking(booking: Booking) {
    this.bookings.push(booking);
  }
}
