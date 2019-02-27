import { Request, Response, NextFunction, Send } from "express";

import Authentication from "../services/Authentication";
import Unauthorized from "../models/exceptions/Unauthorized";
import Token from "../models/Token";

export default (isAdmin: boolean = false) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token: string = request.query.token || request.headers["x-access-token"];
            const data: Token = Authentication.identifyProvider(token);

            (request as any).token = { ...data }; // to avoid warning

            if (isAdmin && !data.isAdmin) {
                throw new Unauthorized("this access is restricted to the administrator");
            }

            // overload .json() method to inject refresh token
            const send: any = response.json;
            response.json = function(response) {
                if (response.data) {
                    response.data.token = Authentication.refreshToken(token);
                }

                send.call(this, response);
            } as Send;
        } catch (err) {
            if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError" || err instanceof Unauthorized) {
                // return response.status(Unauthorized.statusCode).json({ errors: ["token: " + err.message] });
                return response.redirect("/sign?error=" + encodeURIComponent(err.message));
            } else {
                return response.status(Unauthorized.statusCode).json({ errors: [err.message] });
            }
        }

        next();
    }
};
