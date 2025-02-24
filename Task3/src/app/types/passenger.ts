export interface Passenger {
    full_name: string;
    passport_number: string;
    Luggage: {
        cabin: number;
        checked: number;
        heavy: number;
    }
}