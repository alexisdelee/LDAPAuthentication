import * as express from "express";

import webconfig from "./webconfig";
import application from "./Application";
import InternalError from "./models/exceptions/InternalError";

application.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(error);

    try {
        if (error) {
            if (error instanceof SyntaxError) {
                throw new InternalError("invalid json syntax");
            }

            throw new InternalError(error.message ? error.message : "error");
        }
    } catch(e) {
        response.status(e.code).json({ errors: [ e.message ] });
    }
});

application.listen(process.env.PORT || webconfig.application.port, () => {
    console.log("Worker " + process.pid + " running a dev server listening on port " + (process.env.PORT || webconfig.application.port));
});
