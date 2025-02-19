import { Routes } from "@angular/router";
import { LastMinuteFlightsComponent } from "./components/last-minute-flights/last-minute-flights.component";
import { AdminAddDestinationComponent } from "./components/admin-add-destination/admin-add-destination.component";
import { AdminAddFlightComponent } from "./components/admin-add-flight/admin-add-flight.component";
import { AdminManageFlightsComponent } from "./components/admin-manage-flights/admin-manage-flights.component";
import { AdminManageDestinationsComponent } from "./components/admin-manage-destinations/admin-manage-destinations.component";
import { UserBookFlightComponent } from "./components/user-book-flight/user-book-flight.component";
import { UserBookFlightFormComponent } from "./components/user-book-flight-form/user-book-flight-form.component";
import { UserManageBookingsComponent } from "./components/user-manage-bookings/user-manage-bookings.component";
import { DestinationDetailsComponent } from "./components/destination-details/destination-details.component";
import { GuidanceComponent } from "./components/guidance/guidance.component";
import { FlightDetailsComponent } from "./components/flight-details/flight-details.component";
import { UserBookingDetailsComponent } from "./components/user-booking-details/user-booking-details.component";
import { AdminEditFlightComponent } from "./components/admin-edit-flight/admin-edit-flight.component";
import { AdminEditDestinationComponent } from "./components/admin-edit-destination/admin-edit-destination.component";

export const routes: Routes = [
  {
    path: "",
    component: LastMinuteFlightsComponent,
  },
  {
    path: "admin-add-destination",
    component: AdminAddDestinationComponent,
  },
  {
    path: "admin-add-flight",
    component: AdminAddFlightComponent,
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
    path: "admin-edit-flight/:flight_id",
    component: AdminEditFlightComponent,
  },
  {
    path: "admin-edit-destination/:destination_id",
    component: AdminEditDestinationComponent,
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
