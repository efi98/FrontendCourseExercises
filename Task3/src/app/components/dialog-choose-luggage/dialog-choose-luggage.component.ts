import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DialogData {
    name: string;
    luggage: {
        cabin: number;
        checked: number;
        heavy: number;
    };
}

@Component({
    selector: 'app-dialog-choose-luggage',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatTooltipModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions
    ],
    templateUrl: './dialog-choose-luggage.component.html',
    styleUrls: ['./dialog-choose-luggage.component.scss']
})
export class DialogChooseLuggageComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<DialogChooseLuggageComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    isSaveDisabled: boolean = false;

    ngOnInit() {
        this.checkTotalItems();
    }

    checkTotalItems() {
        const luggage = this.data.luggage;
        const totalItems = luggage.cabin + luggage.checked + luggage.heavy;
        this.isSaveDisabled = totalItems > 9;
    }

    onLuggageChange() {
        this.checkTotalItems();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick() {
        this.dialogRef.close(this.data.luggage);
    }
}
