import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { API, AUTH } from '../shared/api';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    isRefreshingToken = false;

    constructor(
        private auth: AuthService,
        private toastCtrl: ToastController,
    ) { }

    // Intercept every HTTP call
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Check if we need additional token logic or not
        if (TokenInterceptor.isInBlockedList(request.url)) {
            return next.handle(request);
        } else {
            return next.handle(this.addToken(request)).pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse) {
                        switch (err.status) {
                            case 400:
                                return throwError(err)
                            case 401:
                                return this.handle401Error(request, next);
                            default:
                                return throwError(err);
                        }
                    } else {
                        return throwError(err);
                    }
                })
            );

        }
    }

    // Filter out URLs where you don't want to add the token!
    private static isInBlockedList(url: string): Boolean {
        return url == environment.scheme + environment.baseUrl + AUTH + API.LOGIN + environment.apiKey;
    }

    // Add our current access token from the service if present
    private addToken(req: HttpRequest<any>) {
        return req;
    }

    // Indicates our access token is invalid, try to load a new one
    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Check if another call is already using the refresh logic
        if (!this.isRefreshingToken) {
            // Set to null so other requests will wait until we got a new token!
            this.tokenSubject.next(null);
            this.isRefreshingToken = true;
            this.auth.currentAccessToken = null;

            // First, get a new access token
            return this.auth.getToken().pipe(
                switchMap((tokens: { expires_at, request_token, success }) => {
                    if (tokens && tokens.success) {
                        // Store the new token
                        const accessToken = tokens.request_token;
                        return this.auth.storeAccessTokens(tokens).pipe(
                            switchMap(_ => {
                                // Use the subject so other calls can continue with the new token
                                this.tokenSubject.next(accessToken);

                                // Perform the initial request again with the new token
                                return next.handle(this.addToken(request));
                            })
                        );
                    } else {
                        // No new token or other problem occurred
                        return of(null);
                    }
                }),
                finalize(() => {
                    // Unblock the token reload logic when everything is done
                    this.isRefreshingToken = false;
                })
            );
        } else {
            // "Queue" other calls while we load a new token
            return this.tokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    // Perform the request again now that we got a new token!
                    return next.handle(this.addToken(request));
                })
            );
        }
    }
}