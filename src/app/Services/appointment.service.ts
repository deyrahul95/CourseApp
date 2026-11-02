import { Service } from '@angular/core';
import { Appointment } from '../Models/appointment';

@Service()
export class AppointmentService {
  private STORAGE_KEY: string = 'appointments';
  private appointments: Appointment[] = [];

  constructor() {
    this.appointments = this.retrieve();
  }

  getAll(): Appointment[] {
    return this.appointments;
  }

  get(id: number): Appointment | null {
    return this.appointments.find((app) => app.id === id) ?? null;
  }

  add(appointment: Appointment): void {
    appointment.id = this.generateUniqueId();
    this.appointments.push(appointment);
    this.store();
  }

  update(appointment: Appointment): void {
    const index = this.appointments.findIndex((app) => app.id === appointment.id);

    if (index !== -1) {
      this.appointments[index] = appointment;
      this.store();
    }
  }

  delete(id: number): void {
    const index = this.appointments.findIndex((app) => app.id === id);

    if (index !== -1) {
      this.appointments.splice(index, 1);
      this.store();
    }
  }

  private generateUniqueId(): number {
    return Date.now();
  }

  private store(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.appointments));
  }

  private retrieve(): Appointment[] {
    const jsonData = localStorage.getItem(this.STORAGE_KEY);

    if (jsonData) {
      return JSON.parse(jsonData) as Appointment[];
    }

    return [];
  }
}
