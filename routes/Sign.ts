import { Request, Response, Router } from "express";

import Authentication from "../services/Authentication";
import NotFound from "../models/exceptions/NotFound";

export default class Sign {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.get("/", this.main.bind(this.main));
        this.router.post("/", this.login.bind(this.login));
    }

    private main(request: Request, response: Response): void {
        response.render("sign");
    }

    private async login(request: Request, response: Response): Promise<any> {
        try {
            const auth: Authentication = new Authentication(request.body.username || "", request.body.password || "");
            const token = await auth.ldap_authenticate();

            response.json({ token });
        } catch(errors) {
            response.status(NotFound.statusCode).json({ errors });
        }
    }
}
