import { Component, inject } from '@angular/core';
import { CourseService } from '../../Services/course.service';
import { Course } from '../../Models/course';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [DatePipe],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  private courseService = inject(CourseService);

  courses: Course[] = [];

  ngOnInit() {
    this.courses = this.courseService.getCourses();
  }

  refreshCourses() {
    this.courses = this.courseService.getCourses();
  }
}
