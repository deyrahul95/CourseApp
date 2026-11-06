import { inject, Service } from '@angular/core';
import { Appointment } from '../Models/appointment';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Service()
export class AppointmentService {
  private http = inject(HttpClient);

  private apiUrl: string = `${environment.serverUrl}/appointments`;

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  get(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(this.apiUrl + `/${id}`);
  }

  add(appointment: Appointment): Observable<void> {
    return this.http.post<void>(this.apiUrl, appointment, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  update(appointment: Appointment): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/${appointment.id}`, appointment, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }
}
