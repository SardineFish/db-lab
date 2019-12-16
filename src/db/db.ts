import sql from "mssql";
import { DBConfig } from "./config";


const pool = new sql.ConnectionPool({
    user: DBConfig.user,
    password: DBConfig.password,
    server: DBConfig.server,
    database: DBConfig.database
});

let connected: boolean = false;

export const DataBase = {
    pool: pool,
    connect: async () =>
    {
        if (!connected)
        {
            await pool.connect();
            connected = true;
        }
    }
};