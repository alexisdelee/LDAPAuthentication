export default class InternalError extends Error {
    public code: number;

    constructor(message: string) {
        super(message);

        this.message = "internal error: " + message;
        this.code = InternalError.statusCode;
    }

    static get statusCode(): number {
        return 500;
    }
}
