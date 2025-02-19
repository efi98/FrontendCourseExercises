import { Passenger, Flight } from "@types";

export interface Booking {
    booking_id: string;
    flight: Flight;
    passengers: Passenger[];
}