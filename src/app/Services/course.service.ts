import { Service } from '@angular/core';
import { Course } from '../Models/course';

@Service()
export class CourseService {
  private COURSE_KEY: string = 'COURSE-KEY';

  courses: Course[] = [];

  constructor() {
    this.courses = this.loadCourses();
  }

  private loadCourses(): Course[] {
    try {
      const raw = localStorage.getItem(this.COURSE_KEY);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as Course[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.log(`Error loading courses. Error: ${err}`);
      return [];
    }
  }

  getCourses(): Course[] {
    return this.courses;
  }

  addCourse(course: Course): void {
    if (!course) {
      return;
    }

    course.id = crypto.randomUUID();
    course.updatedAt = new Date().toUTCString();

    this.courses.push(course);
    localStorage.setItem(this.COURSE_KEY, JSON.stringify(this.courses));
  }
}
