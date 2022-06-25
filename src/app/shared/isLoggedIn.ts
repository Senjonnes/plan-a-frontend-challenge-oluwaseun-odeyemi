import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IsLoggedIn {

    constructor(
        private router: Router,
        private auth: AuthService
    ) { }

    resolve(): void {
        this.auth.isAuthenticated.pipe().subscribe(isAuthenticated => {
            if (!isAuthenticated) {
                this.router.navigateByUrl('/login', { replaceUrl: true });
            }
        })
    }
}