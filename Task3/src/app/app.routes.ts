import { Routes } from "@angular/router";
import { HomePageComponent } from "./components/home-page/home-page.component";
import { AdminManageFlightsComponent } from "./components/admin-manage-flights/admin-manage-flights.component";
import {
    AdminManageDestinationsComponent
} from "./components/admin-manage-destinations/admin-manage-destinations.component";
import { UserBookFlightComponent } from "./components/user-book-flight/user-book-flight.component";
import { UserBookFlightFormComponent } from "./components/user-book-flight-form/user-book-flight-form.component";
import { UserManageBookingsComponent } from "./components/user-manage-bookings/user-manage-bookings.component";
import { DestinationDetailsComponent } from "./components/destination-details/destination-details.component";
import { GuidanceComponent } from "./components/guidance/guidance.component";
import { FlightDetailsComponent } from "./components/flight-details/flight-details.component";
import { UserBookingDetailsComponent } from "./components/user-booking-details/user-booking-details.component";
import { AdminFlightFormComponent } from "./components/admin-flight-form/app-admin-flight-form";
import { AdminDestinationFormComponent } from "./components/admin-destination-form/admin-destination-form.component";

export const routes: Routes = [
    {
        path: "",
        component: HomePageComponent,
    },
    {
        path: "admin-flight/new",
        component: AdminFlightFormComponent
    },
    {
        path: "admin-flight/edit/:flight_id",
        component: AdminFlightFormComponent
    },
    {
        path: "admin-destination/new",
        component: AdminDestinationFormComponent
    },
    {
        path: "admin-destination/edit/:destination_id",
        component: AdminDestinationFormComponent
    },
    {
        path: "admin-manage-flights",
        component: AdminManageFlightsComponent,
    },
    {
        path: "admin-manage-destinations",
        component: AdminManageDestinationsComponent,
    },
    {
        path: "user-book-flight",
        component: UserBookFlightComponent,
    },
    {
        path: "user-book-flight-form/:flight_id",
        component: UserBookFlightFormComponent,
    },
    {
        path: "user-manage-bookings",
        component: UserManageBookingsComponent,
    },
    {
        path: "destination-details/:destination_code",
        component: DestinationDetailsComponent,
    },
    {
        path: "flight-details/:flight_id",
        component: FlightDetailsComponent,
    },
    {
        path: "user-booking-details/:booking_id",
        component: UserBookingDetailsComponent,
    },
    {
        path: "help",
        component: GuidanceComponent,
    },
    {
        path: "**",
        redirectTo: "",
    }
];
