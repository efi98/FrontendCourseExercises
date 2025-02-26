import { Flight, Passenger } from "@types";

export interface Booking {
    booking_id: string;
    flight: Flight;
    passengers: Passenger[];
    codeCoupon?: string;  // Optional
    totalPrice: number;   // Final price after coupon
}
