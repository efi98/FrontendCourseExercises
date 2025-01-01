import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { DestinationsService } from '../services/destinations.service';
import { FlightsService } from '../services/flights.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-add-flight',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './admin-add-flight.component.html',
  styleUrl: './admin-add-flight.component.scss',
})
export class AdminAddFlightComponent {
  flightForm!: FormGroup;
  destinations_service = inject(DestinationsService);
  flight_service = inject(FlightsService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.flightForm = this.formBuilder.group({
      // destonation name has to be filled in
      flight_id: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      boarding_date: ['', Validators.required],
      boarding_time: ['', Validators.required],
      arrival_date: ['', Validators.required],
      arrival_time: ['', Validators.required],
      number_of_passengers: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
    },
    {
      validators: [
        this.dateLessThan('boarding_date', 'arrival_date'),
        this.dateNotInPast('boarding_date'),
        this.dateNotInPast('arrival_date'),
      ],
    });
    
  }

  // Validator to ensure a date is not in the past
  dateNotInPast(controlName: string) {
    return (formGroup: AbstractControl) => {
      const controlValue = formGroup.get(controlName)?.value;
      if (controlValue && new Date(controlValue) < new Date()) {
        formGroup.get(controlName)?.setErrors({ pastDate: true });
      } else {
        formGroup.get(controlName)?.setErrors(null);
      }
    };
  }

  // Validator to ensure boarding date is before arrival date
  dateLessThan(startDate: string, endDate: string) {
    return (formGroup: AbstractControl) => {
      const start = formGroup.get(startDate)?.value;
      const end = formGroup.get(endDate)?.value;
      if (start && end && new Date(start) > new Date(end)) {
        formGroup.get(endDate)?.setErrors({ dateMismatch: true });
      } else {
        formGroup.get(endDate)?.setErrors(null);
      }
    };
  }

  public get destinations() {
    return this.destinations_service.destinations;
  }

  addFlight() {
    if (this.flightForm.valid) {
      const existingFlight = this.flight_service.flights.find(
        (f) => f.flight_id == this.flightForm.value.flight_id
      );
      if (existingFlight) {
        alert('Flight with this ID already exists!');
        return;
      }
      // check boarding date is before arrival date
      if (
        new Date(this.flightForm.value.boarding_date) >
        new Date(this.flightForm.value.arrival_date)
      ) {
        alert('Boarding date must be before arrival date!');
        return;
      }
      // check that origin and destination are different
      if (this.flightForm.value.origin === this.flightForm.value.destination) {
        alert('Origin and destination must be different!');
        return;
      }
      const destination = this.destinations_service.destinations.find(
        (d) => d.destination_name === this.flightForm.value.destination
      );

      this.flight_service.addFlight({
        ...this.flightForm.value,
        image_url: destination?.image_url,
        link: destination?.airport_url,
        airportName: destination?.airport_name,
        airportWebsite: destination?.airport_url,
      });
      alert('Flight added successfully!');
      this.router.navigate(['/admin-manage-flights']);
    } else {
      // Mark all fields as touched to show validation messages
      this.flightForm.markAllAsTouched();
      alert('Please fill in all required fields before submitting.');
    }
  }
}
