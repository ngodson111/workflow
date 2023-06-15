import {
  createPool,
  OkPacket,
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

//!Types
interface Transaction {
  execute: <
    T extends
      | RowDataPacket[]
      | RowDataPacket[][]
      | OkPacket
      | OkPacket[]
      | ResultSetHeader
  >(
    sql: string,
    params: any[]
  ) => Promise<T>;
  start: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
}

const pool: Pool = createPool({
  connectionLimit: 10,
  host: DB_HOST,
  port: DB_PORT ? +DB_PORT : 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  queueLimit: 0,
});

const getConnection = async (): Promise<Transaction> => {
  const connection: PoolConnection = await pool.getConnection();
  return {
    execute: async <
      T extends
        | RowDataPacket[]
        | RowDataPacket[][]
        | OkPacket
        | OkPacket[]
        | ResultSetHeader
    >(
      sql: string = "",
      params: any[] = []
    ): Promise<T> => {
      try {
        if (!sql) throw new Error("Invalid sql query");
        const [result] = await connection.query<T>(sql, params);
        return result;
      } catch (error: any) {
        error.level = "DB";
        throw error;
      }
    },
    start: () => connection.beginTransaction(),
    commit: () => connection.commit(),
    rollback: () => connection.rollback(),
    release: () => connection.release(),
  };
};

process.on("SIGINT", () => {
  pool.end();
});

export default getConnection;
