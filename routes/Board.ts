import { Request, Response, Router } from "express";

import Authentication from "../middlewares/Authentication";
import Score from "../services/Score";
import ScoreBean from "../models/Score";

export default class Board {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.get("/", this.main.bind(this.main));
        this.router.get("/api", [ Authentication(true) ], this.read.bind(this.read));
    }

    private main(request: Request, response: Response): void {
        response.render("board");
    }

    private async read(request: Request, response: Response): Promise<void> {
        const scores: Array<ScoreBean> = await Score.readAll();
        response.status(200).json({ scores });
    }
}
