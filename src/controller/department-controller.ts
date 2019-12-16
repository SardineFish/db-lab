import { DataBase } from "../db/db";

async function get(): Promise<string[]>
{
    await DataBase.connect();

    const query = `SELECT DISTINCT Sdept FROM Student`;
    const result = await DataBase.pool.request()
        .query(query);
    const data = result.recordset;
    return data.map(d => (d["Sdept"] as string));
}

export const DepartmentController = {
    get: get
};