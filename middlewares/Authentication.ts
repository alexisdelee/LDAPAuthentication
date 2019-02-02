import { Request, Response, NextFunction, Send } from "express";

import Authentication from "../services/Authentication";
import Unauthorized from "../models/exceptions/Unauthorized";
import Token from "../models/Token";

export default () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token: string = request.query.token || request.headers["x-access-token"];
            const data: Token = Authentication.identifyProvider(token);

            (request as any).token = { // to avoid warning
                uid: data.uid
            };

            // overload .json() method to inject refresh token
            const send: any = response.json;
            response.json = function(response) {
                if (response.data) {
                    response.data.token = Authentication.refreshToken(token);
                }

                send.call(this, response);
            } as Send;
        } catch (err) {
            if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
                // return response.status(Unauthorized.statusCode).json({ errors: ["token: " + err.message] });
                return response.redirect("/sign?error=" + encodeURIComponent(err.message));
            } else {
                return response.status(Unauthorized.statusCode).json({ errors: [err.message] });
            }
        }

        next();
    }
};
