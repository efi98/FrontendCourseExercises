import { Component, inject } from '@angular/core';
import { DestinationsService } from '../../services/destinations.service';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-admin-manage-destinations',
    imports: [MatTableModule, RouterModule, MatIconModule, MatButtonModule, CommonModule],
    templateUrl: './admin-manage-destinations.component.html',
    styleUrl: './admin-manage-destinations.component.scss',
})
export class AdminManageDestinationsComponent {
    destinations_service = inject(DestinationsService);
    displayedColumns: string[] = [
        'destination_name',
        'airport_name',
        'airport_url',
        'status',
        'actions',
    ];
}
