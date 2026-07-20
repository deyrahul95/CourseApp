import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Course } from '../../Models/course';
import { CourseService } from '../../Services/course.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private courseService = inject(CourseService);

  courses: Course[] = [];
  supportedLanguages: string[] = ['English', 'Bengali', 'Hindi', 'Japanese', 'Spanish', 'Thai'];
  isLoading: boolean = false;

  courseModel = {
    title: '',
    description: '',
    language: '',
    thumbnail: '',
  };

  ngOnInit() {
    this.courses = this.courseService.getCourses();
    this.generateRandomThumbnail().then((data) => {
      this.courseModel.thumbnail = data;
    });
  }

  private async generateRandomThumbnail(): Promise<string> {
    const response = await fetch('https://picsum.photos/300/200');
    return response.url;
  }

  async saveCourse(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    this.courseService.addCourse(form.value);
    this.courses = this.courseService.getCourses();
    form.reset();
    this.courseModel.thumbnail = await this.generateRandomThumbnail();
    this.isLoading = false;
  }
}
