import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../Models/appointment';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { InfoTooltip } from '../../Components/info-tooltip/info-tooltip';

@Component({
  selector: 'app-appointment',
  imports: [FormsModule, DatePipe, ReactiveFormsModule, InfoTooltip],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit {
  private STORAGE_KEY: string = 'appointments';

  appointments: Appointment[] = [];
  appointmentForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.appointments = this.retrieve();
    this.appointmentForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@(?:gmail\.com|outlook\.com|yahoo\.com)$/i),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 11);

    input.value = digitsOnly;
    this.appointmentForm.controls['phone'].setValue(digitsOnly);
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      alert('Please enter all required fields.');
      return;
    }

    const appointment: Appointment = {
      id: Date.now(),
      title: this.appointmentForm.get('title')?.value,
      date: this.appointmentForm.get('date')?.value,
      startTime: this.appointmentForm.get('startTime')?.value,
      name: this.appointmentForm.get('name')?.value,
      email: this.appointmentForm.get('email')?.value,
      phone: this.appointmentForm.get('phone')?.value,
    };

    this.appointments.push(appointment);
    this.store();
    this.resetForm();
  }

  deleteAppointment(index: number) {
    this.appointments.splice(index, 1);
    this.store();
  }

  private resetForm(): void {
    this.appointmentForm.markAsUntouched();
    this.appointmentForm.reset();
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
