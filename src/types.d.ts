declare module "bun:sqlite" {
  export interface Database {
    run(sql: string, params?: any[]): { lastInsertRowId: number };
    query(sql: string): { get(): any; all(): any[] };
    exec(sql: string): void;
  }

  export class Database {
    constructor(filename: string, options?: { readonly?: boolean; create?: boolean; readwrite?: boolean });
    run(sql: string, params?: any[]): { lastInsertRowId: number };
    query(sql: string): { get(): any; all(): any[] };
    exec(sql: string): void;
  }
}
