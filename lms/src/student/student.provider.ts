import { Student } from './student.entity.js';

export const studentProviders = [
  {
    provide: 'STUDENT_REPOSITORY',
    useValue: Student,
  },
];