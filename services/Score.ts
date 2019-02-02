const lodashId = require("lodash-id");

import * as lowdb from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";

export default class Score {
    private static getInstance(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const adapter = new FileAsync("db.json");
            const db = await lowdb(adapter);

            db._.mixin(lodashId);
            resolve(db);
        });
    }

    static read(uid: number, last: number): Promise<Array<number>> {
        return new Promise(async (resolve, reject) => {
            let collection = ((await Score.getInstance()) as any)
                .defaults({ scores: {} })
                .get("scores")
                .defaults({ [ uid ]: [] });
            
            const scores = collection
                .get(uid)
                .take(last)
                .value();
            
            resolve(scores);
        });
    }

    static async save(score: number, uid: number): Promise<Array<number>> {
        return new Promise(async (resolve, reject) => {
            let collection = ((await Score.getInstance()) as any)
                .defaults({ scores: {} })
                .get("scores")
                .defaults({ [ uid ]: [] });
            
            const data: any = { value: score, iat: new Date().getTime() };

            await collection
                .get(uid)
                .unshift(data)
                .write();
            
            resolve([ data ]);
        });
    }
}
