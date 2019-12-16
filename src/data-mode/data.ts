export interface Student
{
    name: string;
    sno: string;
    gender: string;
    age: number;
    department: string;
    scholarship: boolean;
}

export interface Course
{
    cno: string;
    name: string;
    priorCourse: string;
    credit: number;
}

export interface StudentCourse
{
    sno: string;
    cno: string;
    grade: number;
}