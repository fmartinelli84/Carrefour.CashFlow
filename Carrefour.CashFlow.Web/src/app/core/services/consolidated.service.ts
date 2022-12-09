import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsolidatedService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/consolidated`);
  }
}
