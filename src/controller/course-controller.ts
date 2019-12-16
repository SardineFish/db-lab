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

export const wrapCourseData = (data: CourseRow): Course =>
{
    return {
        name: data.Cname.replace(/ /g, ""),
        cno: data.Cno.replace(/ /g, ""),
        priorCourse: data.Cpno === null ? "" : data.Cpno.replace(/ /g, ""),
        credit: data.Ccredit
    };
}

async function get(): Promise<Course[]>
{
    await DataBase.connect();

    const query = `SELECT * FROM Course`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset as IRecordSet<CourseRow>;
    return data.map(wrapCourseData);
}

async function getByCno(cno: string): Promise<Course>
{
    await DataBase.connect();

    const query = `SELECT * FROM Course`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset as IRecordSet<CourseRow>;
    return data.length > 0 ? wrapCourseData(data[0]) : null;
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
    getByCno: getByCno,
    add: add,
    remove: remove,
    update: update
};