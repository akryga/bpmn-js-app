import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmlLoaderService {

  constructor(private http: HttpClient) {}

  public getXml(name: string): Observable<string> {
    const url = 'assets/'+name;
    // let queryParams = new HttpParams();
    // queryParams = queryParams.append( 'from', 1);
    // queryParams = queryParams.append('per_page', 5);
    return this.http.get(url, { responseType: 'text' });
  }
}
