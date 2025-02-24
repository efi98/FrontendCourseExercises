import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { FlightsService } from "../../services/flights.service";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { UserBookFlightComponent } from "../user-book-flight/user-book-flight.component";

@Component({
    selector: "app-last-minute-flights",
    imports: [CommonModule, MatCardModule, MatTableModule, RouterModule, MatIconModule, UserBookFlightComponent],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
})
export class HomePageComponent {
    flights_service: FlightsService = inject(FlightsService);
    last_minute_flights = this.flights_service.flightsByFilters({startDate: new Date()});
}
