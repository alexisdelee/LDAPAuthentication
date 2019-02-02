import { Request, Response, Router } from "express";

export default class Index {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.get("/", this.main.bind(this.main));
        this.router.get("/logout", this.logout.bind(this.logout));
    }

    private main(request: Request, response: Response): void {
        response.render("index");
    }

    private logout(request: Request, response: Response): void {
        response.render("logout");
    }
}
