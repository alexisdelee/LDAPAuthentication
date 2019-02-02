export default class Conflict extends Error {
    public code: number;

    constructor(message: string) {
        super(message);

        this.message = "conflict: " + message;
        this.code = Conflict.statusCode;
    }

    static get statusCode(): number {
        return 409;
    }
}
