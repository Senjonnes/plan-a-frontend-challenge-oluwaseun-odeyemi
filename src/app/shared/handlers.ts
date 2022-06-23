import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class Handlers {
    constructor(
        private router: Router,
    ) { }

    navigate(route: string) {
        this.router.navigateByUrl(route);
    }

    getCurrentRoute() {
        return this.router.url;
    }

    getErrorMessage(name: any, value: string, check?: string) {
        if (value === 'Phone Number' && name.status === 'INVALID') {
            return 'Invalid Phone Number';
        } else if (name.hasError('required')) {
            return `${value} field is required`;
        } else if (check && name.hasError('pattern')) {
            return 'You have entered an invalid character';
        } else if (name.hasError('minlength')) {
            return value + ' length is too short';
        } else if (name.hasError('maxlength')) {
            return 'Invalid input';
        } else if (name.hasError('min')) {
            return `${value} cannot been lesser than ${name.errors.min.min}`;
        } else if (name.hasError('max')) {
            return `${value} cannot been greater than ${name.errors.max.max}`;
        } else if (value === 'Email' && name.hasError('pattern')) {
            return 'Invalid ' + value;
        } else if (value === 'Phone Number' && name.hasError('pattern')) {
            return 'Invalid ' + value;
        } else if (name.hasError('NoPassswordMatch')) {
            return 'Password do not match';
        }
        return '';
    }
}