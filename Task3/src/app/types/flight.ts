import { Status } from "@types";

export interface Flight {
    flight_id: string;
    flight_name: string;
    boarding_date: string;
    boarding_time: string;
    arrival_date: string;
    arrival_time: string;
    origin: string;
    destination: string;
    status: Status;
    image_url: string;
    link: string;
    airportName: string;
    airportWebsite: string;
    numberOfPassengers: number;
    price: number; // New field for flight price
}