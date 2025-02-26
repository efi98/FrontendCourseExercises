import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { DestinationsService } from "../../services/destinations.service";
import { Destination } from "@types";
import { first, map, Subscription } from "rxjs";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-admin-edit-destination",
    imports: [ReactiveFormsModule, MatButtonModule,
        MatIconModule, MatRadioModule, MatFormFieldModule, MatInputModule, RouterModule, CommonModule],

    templateUrl: "./admin-destination-form.component.html",
    styleUrl: "./admin-destination-form.component.scss",
})
export class AdminDestinationFormComponent {
    destination?: Destination;
    destinationForm!: FormGroup;
    destination_service = inject(DestinationsService);
    all_destinations: Destination[] = [];
    destinations_subscription!: Subscription;
    isEditMode: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.destinationForm = this.formBuilder.group({
            // destonation name has to be filled in
            destination_name: ["", Validators.required],
            airport_name: ["", Validators.required],
            airport_url: ["", [Validators.required, Validators.pattern("https?://.+")]],
            image_url: ["", [Validators.required, Validators.pattern("https?://.+")]],
            status: [null, Validators.required]
        });
    }

    ngOnDestroy(): void {
        this.destinations_subscription.unsubscribe();
    }

    ngOnInit(): void {
        let destination_Observable =
            this.destination_service.destinations.pipe(first(), map((destination) => {
                this.all_destinations = destination;
            }));

        this.destinations_subscription = destination_Observable.subscribe({
            next: (next) => {
                console.log('loaded!');
            },
            error: err => {
                console.log(err);
            },
            complete: () => {
                const destinationId = this.route.snapshot.paramMap.get("destination_id");
                if (destinationId) {
                    this.isEditMode = true;
                    this.loadDestination(destinationId);
                }
            }
        });
    }

    loadDestination(destinationId: string) {
        const destination = this.all_destinations.find((d) => d.destination_id == destinationId);
        if (!destination) {
            alert("Destination not found.");
            this.router.navigate(["/admin-manage-flights"]);
            return;
        }
        this.destination = destination;
        this.destinationForm.patchValue(this.destination);
    }

    submitForm() {
        if (this.destinationForm.valid) {
            const destinationData = {
                destination_id: this.destination?.destination_id,
                ...this.destinationForm.value,
            };

            if (this.isEditMode) {
                this.destination_service.editDestination(destinationData);
                alert("Destination changes saved successfully!");
            } else {
                this.destination_service.addDestination(destinationData);
                alert("Destination added successfully!");
            }
            this.router.navigate(["/admin-manage-destinations"]);
        } else {
            // Mark all fields as touched to show validation messages
            this.destinationForm.markAllAsTouched();
            alert("Please fill in all required fields before submitting.");
        }
    }
}
