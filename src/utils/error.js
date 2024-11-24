export class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

const createHttpError = (status) => (message) => {
    return new HttpError(status, message)
}

export const badRequestError = createHttpError(400)

export const unauthorizedError = createHttpError(401)

export const forbiddenError = createHttpError(403)

export const notFoundError = createHttpError(404)

export const conflictError = createHttpError(409)

export const internalServerError = createHttpError(500)






const isHttpError = (error) => {
    return error instanceof HttpError
}



