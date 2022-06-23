import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, timer } from 'rxjs';

import { ErrorService } from './error.service';

export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/** Handles HttpClient errors */
@Injectable()
export class HttpErrorHandler {
    public errorObject: object;
    constructor(private errorService: ErrorService) { }

    /** Create handleError function that already knows the service name */
    createHandleError = (serviceName = '') => <T>
        (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);

    /**
     * @param serviceName: name of the data service
     * @param operation: name of the failed operation
     * @param result: optional value to return as the observable result
     */

    // initial error handle i took
    handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

        return (error: HttpErrorResponse): Observable<T> => {
            // Todo -> Send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // i added the next two line
            sessionStorage.setItem("errorObject", error.error);
            // checking if the server returns an error message 
            if (error.error.error == undefined || null || error.message == "Http failure response for (unknown url): 0 Unknown Error") {
                //  if the server is out
                this.errorService.errorMessage = "ECONNREFUSED";
                console.log(this.errorService.errorMessage);

            } else {
                this.errorService.errorMessage = error.error.error.message;
                console.log(this.errorService.errorMessage);
            }

            this.errorService.errorMessage = error.error.error.message;
            console.log(this.errorService.errorMessage);


            const message = (error.error instanceof ErrorEvent) ?
                error.error.message :
                `{error code: ${error.status}, body: "${error.message}"}`;


            this.errorObject = {
                "serviceName": serviceName,
                "operation": operation,
                "message": message
            }
            // saving the error to sessionStorage
            sessionStorage.setItem("errorObject", JSON.stringify(this.errorObject));

            // Todo -> Transforming error for user consumption
            // this.errorService.errorMessage = `${serviceName} -> ${operation} failed.\n  Message: ${message}`;
            // -> Return a safe result.

            return of(result);
        };
    }
}