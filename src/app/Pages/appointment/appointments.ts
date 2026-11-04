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
  @ViewChild('appointmentModal')
  appointmentModalElement!: ElementRef<HTMLElement>;

  private deleteModalInstance?: Modal;
  private appointmentModalInstance?: Modal;
  private selectedAppointmentId?: number;

  appointments: Appointment[] = [];
  appointmentForm: FormGroup = new FormGroup({});
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    this.appointments = this.appointmentService.getAll();
    this.appointmentForm = this.formBuilder.group({
      id: ['', this.isEditing ? [Validators.required] : []],
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

  submitAppointment(): void {
    if (this.appointmentForm.invalid) {
      alert('Please enter all required fields.');
      return;
    }

    const appointment = this.appointmentForm.value;
    if (this.selectedAppointmentId) {
      this.appointmentService.update(appointment);
    } else {
      this.appointmentService.add(appointment);
    }
    this.resetForm();
    this.selectedAppointmentId = undefined;
    this.appointments = this.appointmentService.getAll();
    this.appointmentModalInstance?.hide();
  }

  openDeleteModal(id: number): void {
    this.selectedAppointmentId = id;

    this.deleteModalInstance ??= new Modal(this.deleteModalElement.nativeElement);
    this.deleteModalInstance.show();
  }

  openAppointModal(id: number | null): void {
    if (id) {
      const appointment = this.appointmentService.get(id);
      if (!appointment) {
        alert(`No Appointment found with id ${id} in our database`);
        return;
      }

      this.selectedAppointmentId = id;
      this.isEditing = true;
      this.appointmentForm.setValue(appointment);
    } else {
      this.resetForm();
    }

    this.appointmentModalInstance ??= new Modal(this.appointmentModalElement.nativeElement);
    this.appointmentModalInstance.show();
  }

  confirmDelete(): void {
    if (!this.selectedAppointmentId) {
      return;
    }

    this.appointmentService.delete(this.selectedAppointmentId);
    this.appointments = this.appointmentService.getAll();
    this.deleteModalInstance?.hide();
  }

  closeDeleteModal(): void {
    this.selectedAppointmentId = undefined;
    this.deleteModalInstance?.hide();
  }

  closeAppointmentModal(): void {
    this.resetForm();
    this.selectedAppointmentId = undefined;
    this.appointmentModalInstance?.hide();
  }

  private resetForm(): void {
    this.appointmentForm.markAsUntouched();
    this.appointmentForm.reset();
  }
}
