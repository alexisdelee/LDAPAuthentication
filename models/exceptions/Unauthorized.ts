export default class Unauthorized extends Error {
    public code: number;

    constructor(message: string) {
        super(message);

        this.message = "unauthorized: " + message;
        this.code = Unauthorized.statusCode;
    }

    static get statusCode(): number {
        return 401;
    }
}
