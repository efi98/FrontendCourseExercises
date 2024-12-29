import { Routes } from '@angular/router';
import { LastMinuteFlightsComponent } from './last-minute-flights/last-minute-flights.component';
import { AdminAddDestinationComponent } from './admin-add-destination/admin-add-destination.component';
import { AdminAddFlightComponent } from './admin-add-flight/admin-add-flight.component';
import { AdminManageFlightsComponent } from './admin-manage-flights/admin-manage-flights.component';
import { AdminManageDestinationsComponent } from './admin-manage-destinations/admin-manage-destinations.component';
import { UserBookFlightComponent } from './user-book-flight/user-book-flight.component';
import { UserBookFlightFormComponent } from './user-book-flight-form/user-book-flight-form.component';
import { UserManageBookingsComponent } from './user-manage-bookings/user-manage-bookings.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { GuidanceComponent } from './guidance/guidance.component';

export const routes: Routes = [
  {
    path: '',
    component: LastMinuteFlightsComponent,
  },
  {
    path: 'admin-add-destination',
    component: AdminAddDestinationComponent,
  },
  {
    path: 'admin-add-flight',
    component: AdminAddFlightComponent,
  },
  {
    path: 'admin-manage-flights',
    component: AdminManageFlightsComponent,
  },
  {
    path: 'admin-manage-destinations',
    component: AdminManageDestinationsComponent,
  },
  {
    path: 'user-book-flight',
    component: UserBookFlightComponent,
  },
  {
    path: 'user-book-flight-form',
    component: UserBookFlightFormComponent,
  },
  {
    path: 'user-manage-bookings',
    component: UserManageBookingsComponent,
  },
  {
    path: 'destination-details/:destination_code',
    component: DestinationDetailsComponent,
  },
  {
    path:'help',
    component: GuidanceComponent
  }
];
