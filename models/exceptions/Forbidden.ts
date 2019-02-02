export default class Forbidden extends Error {
    public code: number;

    constructor(message: string) {
        super(message);

        this.message = "forbidden: " + message;
        this.code = Forbidden.statusCode;
    }

    static get statusCode(): number {
        return 403;
    }
}
