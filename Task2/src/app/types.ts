
export interface Flight {
    flight_id: number
    flight_name: string
    boarding_date: string
    boarding_time: string
    origin: string
    destination: string
    arrival_date: string
    arrival_time: string
    image_url: string
    link: string
    airportName: string
    airportWebsite: string
}

export interface Destination {
    destination_code : number 
    destination_name:string 
    airport_name: string 
    airport_url: string 
    image_url: string
}

export interface Booking {
    flight: Flight
    passengers: number 
    full_name: string 
    passport_number: string
}