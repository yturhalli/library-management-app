export class ErrorData {
    code!: Number
    message!: String
}

export function buildError(code: Number, message: string) : ErrorData  {
    return {
        code,
        message
    }
}
