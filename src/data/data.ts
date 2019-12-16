export interface Student
{
    name: string;
    sno: number;
    gender: string;
    age: number;
    department: string;
    scholarship: boolean;
}

export interface Course
{
    cno: number;
    name: string;
    priorCourse: number;
    credit: number;
}

export interface StudentCourse
{
    sno: number;
    cno: number;
    grade: number;
}