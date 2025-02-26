import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FlightsService } from '../../services/flights.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-admin-manage-flights',
    imports: [MatTableModule, MatButtonModule, RouterModule, MatIconModule],
    templateUrl: './admin-manage-flights.component.html',
    styleUrl: './admin-manage-flights.component.scss',
})
export class AdminManageFlightsComponent {
    displayedColumns: string[] = [
        'flightName',
        'boardingDateTime',
        'arrivalDateTime',
        'origin',
        'destination',
        'status',
        'airportDetails',
        'numberOfPassengers',
        'price',
        'actions'
    ];
    flights_service = inject(FlightsService);

    public get flights() {
        return this.flights_service.flights;
    }
}
