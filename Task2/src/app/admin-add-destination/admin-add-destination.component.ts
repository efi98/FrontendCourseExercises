import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule, MatInput } from '@angular/material/input';
import { DestinationsService } from '../services/destinations.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-add-destination',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './admin-add-destination.component.html',
  styleUrl: './admin-add-destination.component.scss',
})
export class AdminAddDestinationComponent {
  destinationForm!: FormGroup;

  destination_service = inject(DestinationsService);
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.destinationForm = this.formBuilder.group({
      // destonation name has to be filled in
      destination_name: ['', Validators.required],
      airport_name: ['', Validators.required],
      airport_url: [
        '',
        [Validators.required, Validators.pattern('https?://.+')],
      ],
      image_url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  addDestination() {
    if (this.destinationForm.valid) {

      

      this.destination_service.addDestination({
        ...this.destinationForm.value,
        destination_code:
          this.destination_service.destinations
            .map((d) => d.destination_code)
            .reduce((a, b) => Math.max(a, b), 0) + 1,
      });
      alert('Destination added successfully!');
      this.router.navigate(['/admin-manage-destinations']);
    } else {
      // Mark all fields as touched to show validation messages
      this.destinationForm.markAllAsTouched();
      alert('Please fill in all required fields before submitting.');
    }
  }
}
