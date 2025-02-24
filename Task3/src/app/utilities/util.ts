import { AbstractControl, ValidationErrors } from '@angular/forms';

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
    return { invalidPositiveNumber: { value: control.value } };  // Invalid positive number
}
