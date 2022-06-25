import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorHandler } from './error/http-error-handler.service';
import { Forms } from './forms';
import { Handlers } from './handlers';
import { Display } from './display';
import { IsLoggedIn } from './isLoggedIn';



@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        Forms,
        FormBuilder,
        HttpErrorHandler,
        Handlers,
        Display,
        IsLoggedIn
    ]

})
export class SharedModule { }