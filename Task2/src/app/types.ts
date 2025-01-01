export interface Flight {
  flight_id: any;
  flight_name: string;
  boarding_date: string;
  boarding_time: string;
  origin: string;
  destination: string;
  arrival_date: string;
  arrival_time: string;
  image_url: string;
  link: string;
  airportName: string;
  airportWebsite: string;
  numberOfPassengers: number;
}

export interface Destination {
  destination_code: number;
  destination_name: string;
  airport_name: string;
  airport_url: string;
  image_url: string;
}

export interface Passenger {
  full_name: string;
  passport_number: string;
}
export interface Booking {
  booking_id: any;  
  flight: Flight;
  passengers: Passenger[];
}
