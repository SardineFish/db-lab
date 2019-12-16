import { Student, StudentCourse } from "../data-mode/data";
import { DataBase } from "../db/db";
import { wrapStudentData } from "./student-controller";
import { wrapCourseData } from "./course-controller";

const wrapData = (data: any): StudentCourse => ({
    student: wrapStudentData(data),
    course: wrapCourseData(data),
    grade: data["Grade"]
});

async function get(): Promise<StudentCourse[]>
{
    await DataBase.connect();

    const query = 
    `SELECT Student.*, Course.*, SC.Grade
    FROM Student, Course, SC
    WHERE Student.Sno = SC.Sno AND Course.Cno = SC.Cno`;
    
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset;
    return data.map(wrapData);
}

async function getStudentsInCourse(cno: string): Promise< StudentCourse[]>
{
    await DataBase.connect();

    const query =
        `SELECT Student.*, Course.*, SC.*
    FROM Student, Course, SC
    WHERE Student.Sno = SC.Sno AND Course.Cno = SC.Cno AND SC.Cno = '${cno}'`;

    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset;
    return data.map(wrapData);
}

async function update(data: StudentCourse): Promise<void>
{
    await DataBase.connect();
    const query =
        `UPDATE SC
        SET
            Grade = ${data.grade === null ? "NULL" : data.grade}
        WHERE Sno = '${data.student.sno}' AND Cno = '${data.course.cno}'`;
    const result = await DataBase.pool.request()
        .query(query);
}

async function add(data: { sno: string, cno: string, grade?: number })
{
    await DataBase.connect();

    const query =
        `INSERT INTO SC VALUES(
            '${data.sno}',
            '${data.cno}',
            ${data.grade === null ? "NULL" : data.grade}
        );`;

    const result = await DataBase.pool.request()
        .query(query);
}

async function remove(data: StudentCourse): Promise<void>
{
    await DataBase.connect();

    const query =
        `DELETE FROM SC WHERE Sno = '${data.student.sno}' AND Cno = '${data.course.cno}';`;

    const result = await DataBase.pool.request()
        .query(query);
}

export interface DepartmentStatistics
{
    department: string;
    minGrade: number;
    maxGrade: number;
    avgGrade: number;
    total: number;
    goodCount: number;
    badCount: number;
}

async function getDepartmentStatistics(): Promise<DepartmentStatistics[]>
{
    await DataBase.connect();

    const query =
        `SELECT 
            Student.Sdept as department, 
            MIN(SC.Grade) as minGrade, 
            MAX(SC.Grade) as maxGrade, 
            AVG(SC.Grade) as avgGrade,
            COUNT(Student.Sno) as total,
            MIN(Good.Count) as goodCount,
            MIN(Bad.Count) as badCount
        FROM Student 
            JOIN SC ON(Student.Sno = SC.Sno)
            JOIN (SELECT 
                    Student.Sdept,
                    COUNT(Student.Sno) as Count
                FROM Student JOIN SC ON(Student.Sno = SC.Sno)
                WHERE SC.Grade > 90
                GROUP BY Student.Sdept) Good ON (Student.Sdept = Good.Sdept)
            JOIN (SELECT 
                    Student.Sdept,
                    COUNT(Student.Sno) as Count
                FROM Student JOIN SC ON(Student.Sno = SC.Sno)
                WHERE SC.Grade < 60
                GROUP BY Student.Sdept) Bad ON (Student.Sdept = Bad.Sdept)
        GROUP BY Student.Sdept`;

    const result = await DataBase.pool.request()
        .query(query);
    return result.recordset as DepartmentStatistics[];
}

async function getGradesInDepartment(department: string): Promise<StudentCourse[]>
{
    await DataBase.connect();

    const query =
        `SELECT Student.*, Course.*, SC.Grade
        FROM SC
            JOIN Student ON (Student.Sno = SC.Sno)
            JOIN Course ON (Course.Cno = SC.Cno)
        WHERE Student.Sdept = '${department}'
        ORDER BY SC.Grade DESC`;

    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset;
    return data.map(wrapData);
}

async function getCoursesOfStudent(sno: string): Promise<StudentCourse[]>
{
    await DataBase.connect();

    const query =
        `SELECT Student.*, Course.*, SC.Grade
        FROM Student
            JOIN SC ON(Student.Sno = SC.Sno)
            JOIN Course ON (Course.Cno = SC.Cno)
        WHERE Student.Sno = '${sno}'`;

    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset;
    return data.map(wrapData);
}

export const StudentCourseController = {
    get: get,
    getStudentsInCourse: getStudentsInCourse,
    add: add,
    update: update,
    remove: remove,
    getDepartmentStatistics: getDepartmentStatistics,
    getGradesInDepartment: getGradesInDepartment,
    getCoursesOfStudent: getCoursesOfStudent
};