export default class Score {
    public uid: string;
    public value: number;
    public iat: number;

    constructor(uid: string, value: number, iat: number) {
        this.uid = uid;
        this.value = value;
        this.iat = iat;
    }
};
