//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, from, Subject } from 'rxjs';
import { catchError, mergeMap, flatMap, retry } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

export class RestClient {

    defaultRequestOptions: any;

    constructor(protected httpClient: HttpClient, protected authService: AuthenticationService) {

        let defaultHeaders = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });

        this.defaultRequestOptions = {
            headers: defaultHeaders
        }
    }

    get<T>(url: string, options?: any): Observable<T> {
        let reqOptions = Object.assign({}, options);
        return this.doRestCall('Get', url, null, reqOptions);
    }

    post<T>(url: string, body: any, options?: any): Observable<T> {
        return this.doRestCall('POST', url, body, options);
    }

    put<T>(url: string, body: any, options?: any): Observable<T> {
        return this.doRestCall('Put', url, body, options);
    }

    delete<T>(url: string, options?: any): Observable<T> {
        return this.doRestCall('Delete', url, null, options);
    }

    protected doRestCall<T>(requestMethod: string, url: string, data?: any, options?: any): Observable<T> | Observable<never> {

        let reqOptions = this.defaultRequestOptions;

        if (options && options.params)
            reqOptions = Object.assign(reqOptions.params, options.params);

        // merge missing default headers.
        if (!reqOptions.headers) {
            reqOptions.headers = new HttpHeaders();
        }

        if (options && options.headers)
            reqOptions = Object.assign(reqOptions.headers, options.headers);


        this.defaultRequestOptions.headers.keys().forEach((header: string) => {
            if (!reqOptions.headers.has(header)) {
                reqOptions.headers.append(header, this.defaultRequestOptions.headers.get(header));
            }
        });

        let requestObservable: Observable<T>;

        let x = this.authService.getToken()
            .then(jwtToken => {
                if (jwtToken) {
                    reqOptions.headers = reqOptions.headers.append("Authorization", 'Bearer ' + jwtToken);
                   
                }
                if (data instanceof FormData) {
                    reqOptions.headers = reqOptions.headers.delete("content-type");
                }
                // Http Options
                let httpOptions = {
                    headers: reqOptions.headers,
                    body: data
                };
                let apiRequest = this.httpClient
                    .request<T>(requestMethod, url, httpOptions)
                    .pipe(catchError(this.handleError))
                    .toPromise();
                return apiRequest;
            });

        return requestObservable = from(x);
    }

    // Error handling 
    private handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

}
