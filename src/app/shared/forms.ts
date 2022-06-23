import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class Forms {
    constructor(private formBuilder: FormBuilder) { }

    Login() {
        const form = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        });
        return form;
    }

}