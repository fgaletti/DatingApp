import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest,  HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {EMPTY} from 'rxjs';


 // intercep the differents types of error : 401  , typo = object , etc
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe (
            catchError ( error => {
                    if (error  instanceof HttpErrorResponse) {
                         // para el login cuando no es autorizado
                        if (error.status === 401) {
                            return throwError(error.statusText);
                        }
                        const applicationError = error.headers.get('Application-Error');
                        if (applicationError) {
                            console.error(applicationError);
                            return throwError(applicationError);
                        }

                        const serverError = error.error;
                        let modalStateErrors = '';
                        if (serverError && typeof serverError === 'object') {
                            for (const key in serverError) {
                                if (serverError[key]) {
                                    modalStateErrors += serverError[key] + '\n';
                                }
                            }
                        }
                        return throwError(modalStateErrors || serverError || 'Server Error');
                    }
            })
        );
    }
}


export const ErrorInterceptorProvider = {
    provide : HTTP_INTERCEPTORS,
    useClass:  ErrorInterceptor,
    multi: true // ADDED TO INTERCEPTROR
// tslint:disable-next-line:semicolon
}
