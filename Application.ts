import * as express from "express";
import { json, urlencoded } from "body-parser";
import * as helmet from "helmet";

import InternalError from "./models/exceptions/InternalError";

import Index from "./routes/Index";
import Sign from "./routes/Sign";
import Score from "./routes/Score";
import Board from "./routes/Board";

class Application {
    public application: express.Application;

    constructor() {
        // create express js application
        this.application = express();

        this.application.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                if (!request.headers["Content-Type"]) {
                    throw new InternalError("missing content type");
                } else if (request.headers["Content-Type"] !== "application/json") {
                    throw new InternalError("only json format is currently supported");
                }

                next();
            } catch(e) {
                response.status(e.code).json({ errors: [ e.message ] });
            }
        });

        // configure application
        this.config();

        // configures routes
        this.routes();
    }

    private config(): void {
        // support application/json type post data
        this.application.use(json());

        // support application/x-www-form-urlencoded post data
        this.application.use(urlencoded({ extended: true }));

        // help secure express app with various http headers
        this.application.use(helmet());

        // set the view engine to ejs
        this.application.set("view engine", "ejs");

        // serve static files
        this.application.use(express.static("views/assets"));
    }

    private routes(): void {
        // use router middleware
        this.application.use("/", new Index().router);
        this.application.use("/sign", new Sign().router);
        this.application.use("/score", new Score().router);
        this.application.use("/board", new Board().router);
    }
}

export default new Application().application;
