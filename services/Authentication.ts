const LdapAuth = require("ldapauth-fork");

import { verify, sign } from "jsonwebtoken";

import SECRET_TOKEN from "../token";
import webconfig from "../webconfig";
import Token from "../models/Token";

export default class Authentication {
    private username: string;
    private password: string;
    private __ldap_instance__: any;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    static identifyProvider(token: string): Token {
        return verify(token, SECRET_TOKEN) as Token;
    }

    static getToken(data: Token, unlimited: boolean = false): string {
        if (unlimited) {
            return sign(data, SECRET_TOKEN);
        } else {
            return sign(data, SECRET_TOKEN, { expiresIn: "1h" }); // expire after 1h
        }
    }

    static refreshToken(token: string, unlimited: boolean = false) {
        const data: Token = Authentication.identifyProvider(token);
        return Authentication.getToken(data, unlimited);
    }

    ldap_authenticate(): Promise<any> {
        const self = this;

        return new Promise((resolve, reject) => {
            self.__ldap_instance__ = new LdapAuth({
                url: "ldaps://" + webconfig.jumpcloud.url + ":" + webconfig.jumpcloud.port,
                bindDN: "uid=" + webconfig.jumpcloud.api.account + ",ou=Users,o=" + webconfig.jumpcloud.portal + ",dc=jumpcloud,dc=com",
                bindCredentials: webconfig.jumpcloud.api.token,
                searchBase: "ou=Users,o=" + webconfig.jumpcloud.portal + ",dc=jumpcloud,dc=com",
                searchFilter: "(uid={{username}})",
                reconnect: true
            });

            self.__ldap_instance__.authenticate(self.username, self.password, function(err, user) {
                try {
                    if (err) throw err;
    
                    const { uidNumber } = user;
                    resolve(Authentication.getToken({ uid: uidNumber } as Token));
                } catch(err) {
                    reject([
                        err instanceof Error
                            ? err.message
                            : err
                    ]);
                } finally {
                    self.__ldap_instance__.close();
                }
            });
        });
    }
}
