import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  public getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/movements/${id}`);
  }

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/movements`);
  }

  public create(movement: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/movements`, movement);
  }

  public update(movement: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/movements/${movement.id}`, movement);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/movements/${id}`);
  }
}
