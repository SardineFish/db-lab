import { Course } from "../data-mode/data";
import { DataBase } from "../db/db";
import { IRecordSet } from "mssql";

interface CourseRow
{
    Cno: string;
    Cname: string;
    Cpno: string;
    Ccredit: number;
};

async function get(): Promise<Course[]>
{
    await DataBase.connect();

    const query = `SELECT * FROM Course`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset as IRecordSet<CourseRow>;
    return data.map(t => (<Course>{
        name: t.Cname.replace(/ /g, ""),
        cno: t.Cno.replace(/ /g, ""),
        priorCourse: t.Cpno === null ? "" : t.Cpno.replace(/ /g, ""),
        credit: t.Ccredit
    }));
}

async function add(data: Course): Promise<void>
{
    await DataBase.connect();

    const query = `insert into course values('${data.cno}', '${data.name}', '${data.priorCourse}', ${data.credit});`

    const result = await DataBase.pool.request()
        .query(query);
    console.log(result);

}

async function remove(data: Course): Promise<void>
{
    await DataBase.connect();

    const query =
        `BEGIN TRAN

        DELETE FROM SC WHERE Cno = '${data.cno}';
        DELETE FROM Course WHERE Cno = '${data.cno}';

        COMMIT TRAN`;

    const result = await DataBase.pool.request()
        .query(query);
    console.log(result);
}

async function update(data: Course): Promise<void>
{
    await DataBase.connect();

    const query =
        `BEGIN TRAN

        UPDATE Course
        SET
            Cname = '${data.name}',
            Cpno = '${data.priorCourse}',
            Ccredit = '${data.credit}'
        WHERE Cno = '${data.cno}';

        COMMIT TRAN`;
    
    const result = await DataBase.pool.request()
        .query(query);

}

async function removeEmpty()
{
    
}

export const CourseController = {
    get: get,
    add: add,
    remove: remove,
    update: update
};