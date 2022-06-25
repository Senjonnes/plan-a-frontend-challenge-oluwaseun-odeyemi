import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorHandler } from '../shared/error/http-error-handler.service';
import { ErrorService } from '../shared/error/error.service';
import { Handlers } from '../shared/handlers';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API, MOVIE } from '../shared/api';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  public httpErrorHandler: HttpErrorHandler;
  public errorHandle: any;
  public errorService: ErrorService;

  constructor(
    public http: HttpClient,
    public handlers: Handlers,
  ) {
    this.httpErrorHandler = new HttpErrorHandler(this.errorService);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(error);
  }

  getLatestMovies() {
    const url = environment.scheme + environment.baseUrl + MOVIE + API.NOW_PLAYING + environment.apiKey;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}
