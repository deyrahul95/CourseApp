export interface Appointment {
  id: number;
  title: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  name: string;
  email: string;
  phone: string;
}
