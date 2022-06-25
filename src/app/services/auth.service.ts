import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorHandler } from '../shared/error/http-error-handler.service';
import { ErrorService } from '../shared/error/error.service';
import { Handlers } from '../shared/handlers';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API, AUTH } from '../shared/api';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
const ACCESS_TOKEN_KEY = 'access';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public httpErrorHandler: HttpErrorHandler;
  public errorHandle: any;
  public errorService: ErrorService;
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  currentAccessToken = null;

  constructor(
    public http: HttpClient,
    public handlers: Handlers,
    private router: Router,
  ) {
    this.httpErrorHandler = new HttpErrorHandler(this.errorService);
    this.loadToken();
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

  // Load accessToken on startup
  async loadToken() {
    const token = await Storage.get({ key: ACCESS_TOKEN_KEY });
    console.log(token);
    if (token && token.value) {
      this.currentAccessToken = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  getToken() {
    const url = environment.scheme + environment.baseUrl + AUTH + API.TOKEN + environment.apiKey;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(data) {
    const loginData = { ...data, request_token: this.currentAccessToken }
    const url = environment.scheme + environment.baseUrl + AUTH + API.LOGIN + environment.apiKey;
    return this.http.post(url, loginData)
      .pipe(
        catchError(this.handleError)
      );
  }

  async authenticate(data) {
    return new Promise((resolve, reject) => this.getToken().subscribe((res: any) => {
      if (res.success) {
        this.currentAccessToken = res.request_token;
        this.storeAccessTokens(res);
        this.login(data).subscribe(async (response: any) => {
          if (response) {
            this.isAuthenticated.next(true);
            resolve(response);
          }
        }, err => {
          this.isAuthenticated.next(false);
          reject(err)
        })
      }
    })
    )
  }

  async logout() {
    await Storage.clear();
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  storeAccessTokens(tokens) {
    this.currentAccessToken = tokens.request_token;
    const storeAccess = Storage.set({ key: ACCESS_TOKEN_KEY, value: tokens.request_token });
    return from(Promise.all([storeAccess]));
  }
}