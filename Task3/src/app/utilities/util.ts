import { DatePipe } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

export const numOfSeatsPolicy = {min: 1, max: 200};
export const strToBool = (value: string): boolean => value.toLowerCase() === 'true';
export const isValidDate = (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
};
export const luggageWeights = {
    cabin: 8,
    checked: 23,
    heavy: 32
};

// Custom validator to check if the number is positive
export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Check if the value is a positive number (greater than 0)
    if (value && !isNaN(value) && value > 0) {
        return null;  // Valid positive number
    }
    return {invalidPositiveNumber: {value: control.value}};  // Invalid positive number
}

export function dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && isNaN(Date.parse(value))) {
            return {invalidDate: 'The date must be a valid date.'};
        }
        return null;
    };
}

export function endDateValidator(control: AbstractControl): ValidationErrors | null {
    const form = control?.parent;
    if (!form) return null;

    const startDate = form.get('startDate')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return {endDateBeforeStartDate: 'End date must be after start date.'};
    }

    return null;
}

export function convertTimestampToDate(timestamp: { seconds: number, nanoseconds: number }): Date {
    let date: Date;
    date = new Date(timestamp.seconds * 1000);

    // Use Angular DatePipe to format the date as 'yyyy-MM-dd'
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(date, 'yyyy-MM-dd') ?? '';

    // Return both the Date object and formatted date string
    return date;
}


export function convertDateToFormattedDate(date: Date): string {

    // Use Angular DatePipe to format the date as 'yyyy-MM-dd'
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(date, 'yyyy-MM-dd') ?? '';

    // Return both the Date object and formatted date string
    return formattedDate;
}
