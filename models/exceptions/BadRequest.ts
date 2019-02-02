export default class BadRequest extends Error {
    public code: number;

    constructor(message: string) {
        super(message);

        this.message = "bad request: " + message;
        this.code = BadRequest.statusCode;
    }

    static get statusCode(): number {
        return 400;
    }
}
