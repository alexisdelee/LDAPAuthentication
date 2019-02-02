import { Request, Response, Router } from "express";

import Authentication from "../middlewares/Authentication";
import Score from "../services/Score";

export default class Index {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.get("/", [ Authentication() ], this.read.bind(this.read));
        this.router.post("/", [ Authentication() ], this.save.bind(this.save));
    }

    private async read(request: Request, response: Response): Promise<void> {
        const scores: Array<number> = await Score.read((request as any).token.uid, 5);
        response.status(200).json({ scores });
    }

    private async save(request: Request, response: Response): Promise<void> {
        const scores: Array<number> = await Score.save(request.body.score, (request as any).token.uid);
        response.status(200).json({ scores });
    }
}
