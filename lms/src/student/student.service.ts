import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
  getStudents() {
    return [
      {
        SID: '1000',
        SNAME: 'test',
        EMAIL: 'test@test.com',
        TUTORID: '101'
      }
    ];
  }
}