import { Student } from "../data-mode/data";
import { DataBase } from "../db/db";
import { IRecordSet } from "mssql";

interface StudentRow
{
    Sno: string,
    Sname: string,
    Ssex: string,
    Sdept: string,
    Sage: number,
    Scholarship: string,
};

export const wrapStudentData = (data: StudentRow): Student =>
{
    return {
        sno: data.Sno.replace(/ /g, ""),
        name: data.Sname.replace(/ /g, ""),
        age: data.Sage,
        gender: data.Ssex.replace(/ /g, ""),
        department: data.Sdept.replace(/ /g, ""),
        scholarship: data.Scholarship === "是"
    };
};

async function get() : Promise<Student[]>
{
    await DataBase.connect();

    const query = `SELECT * FROM Student`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset as IRecordSet<StudentRow>;
    return data.map(wrapStudentData);
}

async function getBySno(sno: string): Promise<Student>
{
    await DataBase.connect();

    const query = `SELECT * FROM Student WHERE Sno = '${sno}'`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset as IRecordSet<StudentRow>;
    return data.length > 0 ? wrapStudentData(data[0]) : null;
}

async function add(data: Student): Promise<void>
{
    await DataBase.connect();

    const query =
        `INSERT INTO student VALUES(
            '${data.sno}',
            '${data.name}',
            '${data.gender}',
            ${data.age},
            '${data.department}',
            '${data.scholarship ? '是' : '否'}');`;
    
    const result = await DataBase.pool.request()
        .query(query);
    console.log(result);
    
}

async function remove(data: Student): Promise<void>
{
    await DataBase.connect();

    const query =
        `BEGIN TRAN

        DELETE FROM SC WHERE Sno = '${data.sno}';
        DELETE FROM Student WHERE Sno = '${data.sno}';

        COMMIT TRAN`;

    const result = await DataBase.pool.request()
        .query(query);
    console.log(result);
}

async function update(student: Student)
{
    await DataBase.connect();
    const query =
        `UPDATE Student
        SET
            Sname = '${student.name}',
            Ssex = '${student.gender}',
            Sage = ${student.age},
            Sdept = '${student.department}',
            Scholarship = '${student.scholarship ? '是' : '否'}'
        WHERE Sno = ${student.sno}`;
    const result = await DataBase.pool.request()
        .query(query);
}

export const StudentController = {
    get: get,
    getBySno: getBySno,
    add: add,
    remove: remove,
    update: update
};