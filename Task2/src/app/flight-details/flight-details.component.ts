import { Component, inject } from '@angular/core';
import { Flight } from '../types';
import { FlightsService } from '../services/flights.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-details',
  imports: [CommonModule],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss',
})
export class FlightDetailsComponent {
  flight?: Flight;

  flight_service = inject(FlightsService);
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('flight_id'); // Retrieve the parameter
    if (!code) {
      alert('Invalid flight id provided.');
      this.router.navigate(['/admin-manage-flights']); // If no code is provided, redirect to the destinations page
      return;
    }
    const dest = this.flight_service.flights.find((d) => d.flight_id == code); // Find the destination with the matching code
    if (!dest) {
      alert('Destination not found.');
      this.router.navigate(['/admin-manage-destinations']); // If no destination is found, redirect to the destinations page
      return;
    }
    this.flight = dest;
  }
}
