import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { AppointmentService } from '../../Services/appointment.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-appointment',
  imports: [FormsModule, DatePipe, ReactiveFormsModule, InfoTooltip],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit {
  @ViewChild('confirmDeleteModal')
  deleteModalElement!: ElementRef<HTMLElement>;

  private deleteModalInstance?: Modal;
  private selectedAppointmentId?: number;

  appointments: Appointment[] = [];
  appointmentForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    this.appointments = this.appointmentService.getAll();
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

    const appointment = this.appointmentForm.value;
    this.appointmentService.add(appointment);
    this.resetForm();
    this.appointments = this.appointmentService.getAll();
  }

  openDeleteModal(id: number): void {
    this.selectedAppointmentId = id;

    this.deleteModalInstance ??= new Modal(this.deleteModalElement.nativeElement);
    this.deleteModalInstance.show();
  }

  confirmDelete(): void {
    if (this.selectedAppointmentId == null) {
      return;
    }

    this.appointmentService.delete(this.selectedAppointmentId);
    this.appointments = this.appointmentService.getAll();
    this.deleteModalInstance?.hide();
  }

  closeDeleteModal(): void {
    this.deleteModalInstance?.hide();
  }

  private resetForm(): void {
    this.appointmentForm.markAsUntouched();
    this.appointmentForm.reset();
  }
}
