import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../Models/appointment';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment',
  imports: [FormsModule, DatePipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit {
  private STORAGE_KEY: string = 'appointments';

  appointments: Appointment[] = [];
  newAppointment: Appointment = {
    id: Date.now(),
    title: '',
    date: new Date(),
  };

  ngOnInit(): void {
    this.appointments = this.retrieve();
  }

  addAppointment(): void {
    if (this.newAppointment.title.trim().length && this.newAppointment.date) {
      this.newAppointment.title = this.newAppointment.title.trim();
      this.appointments.push(this.newAppointment);
      this.store();
      this.resetAppointment();
    }
  }

  deleteAppointment(index: number) {
    this.appointments.splice(index, 1);
    this.store();
  }

  onDateChange(event: any) {
    this.newAppointment.date = new Date(event.target.value);
  }

  private resetAppointment(): void {
    this.newAppointment = {
      id: Date.now(),
      title: '',
      date: new Date(),
    };
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
