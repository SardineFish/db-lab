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

async function get() : Promise<Student[]>
{
    await DataBase.connect();

    const query = `SELECT * FROM Student`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset as IRecordSet<StudentRow>;
    return data.map(t => (<Student>{
        sno: t.Sno.replace(/ /g, ""),
        name: t.Sname.replace(/ /g, ""),
        age: t.Sage,
        gender: t.Ssex.replace(/ /g, ""),
        department: t.Sdept.replace(/ /g, ""),
        scholarship: t.Scholarship === "是"
    }));
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
            Scholarship = '${student.scholarship}'
        WHERE Sno = ${student.sno}`;
    const result = await DataBase.pool.request()
        .query(query);
}

export const StudentController = {
    get: get,
    add: add,
    remove: remove,
    update: update
};