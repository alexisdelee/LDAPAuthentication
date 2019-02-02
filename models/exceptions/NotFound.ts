export default class NotFound extends Error {
    public code: number;

    constructor(message: string) {
        super(message);

        this.message = "not found: " + message;
        this.code = NotFound.statusCode;
    }

    static get statusCode(): number {
        return 404;
    }
}
