//founded here: http://stackoverflow.com/a/41429145/3232745

export default class DbError extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DbError.prototype);
    }
}
