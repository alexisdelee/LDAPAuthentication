const lodashId = require("lodash-id");

import * as lowdb from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";
import ScoreBean from "../models/Score";

export default class Score {
    private static getInstance(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const adapter = new FileAsync("db.json");
            const db = await lowdb(adapter);

            db._.mixin(lodashId);
            resolve(db);
        });
    }

    static MAX = 5;

    static read(uid: string, last: number): Promise<Array<ScoreBean>> {
        return new Promise(async (resolve, reject) => {
            let collection = ((await Score.getInstance()) as any)
                .defaults({ scores: {} })
                .get("scores")
                .defaults({ [ uid ]: [] });
            
            const scores: Array<ScoreBean> = collection
                .get(uid)
                .take(last)
                .value()
                .map(({ value, iat }) => new ScoreBean(uid, value, iat));
            
            resolve(scores);
        });
    }

    static readAll(): Promise<Array<ScoreBean>> {
        return new Promise(async (resolve, reject) => {
            const results: any = ((await Score.getInstance()) as any)
                .defaults({ scores: {} })
                .get("scores")
                .value();

            let scores: Array<ScoreBean> = [];
            for (const uid in results) {
                for (const score of results[uid]) {
                    scores.push(new ScoreBean(uid, score.value, score.iat));
                }
            }
            
            resolve(scores);
        });
    }

    static async save(score: number, uid: string): Promise<Array<ScoreBean>> {
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
            
            resolve([ new ScoreBean(uid, data.value, data.iat) ]);
        });
    }
}
