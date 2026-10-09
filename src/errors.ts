type JSONPrimitive = string | number | boolean | null;

export type JSONValue =
    | JSONPrimitive
    | JSONValue[]
    | {
          [key: string]: JSONValue;
      };

export type ErrorOptions = Partial<{
    status: number;
    errorCode: APIErrorCode;
    errorMessage: string;
    displayMessage: string;
    content: JSONValue;
}>;

export enum APIErrorCode {
    BadInput = 'E_BAD_INPUT',
    NotAuthenticated = 'E_NOT_AUTHENTICATED',
    Forbidden = 'E_FORBIDDEN',
    NotFound = 'E_NOT_FOUND',
    Conflict = 'E_CONFLICT',
    Duplicate = 'E_DUPLICATE',
    RateLimit = 'E_RATELIMIT',
    InternalServer = 'E_INTERNAL',
    Unavailable = 'E_UNAVAILABLE',
    Unknown = 'E_UNKNOWN'
}

export class APIError extends Error {
    // HTTP status
    public status: number;
    // Alias for `status`
    public statusCode: number;
    // Detailed description of the error that occurred. This field is expected to be
    // set any time the source of the error is known
    public errorMessage: string;
    // As an extension of the status code, an error code can give consistent programmatic
    // feedback to the calling entity on the error that occurred
    public errorCode: APIErrorCode;
    // Description to be displayed to the user, if applicable.
    // An example would be 'Sorry, something went wrong. Please try again later'
    public displayMessage?: string;
    // Arbitrary JSON content; the meaning, format, and value of this field is highly context-dependent
    // and only needed for errors with handling complexity that requires more flexibility than the other
    // error codes can provide
    public content?: JSONValue;

    constructor(status: number, errorMessage: string, errorCode: APIErrorCode, displayMessage?: string, content?: JSONValue) {
        super(errorMessage);
        this.status = status;
        this.statusCode = status;
        this.errorMessage = errorMessage;
        this.displayMessage = displayMessage;
        this.errorCode = errorCode;
        this.content = content;
    }
}

export class BadInputError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(opts?.status ?? 400, opts?.errorMessage ?? 'Invalid input', opts?.errorCode ?? APIErrorCode.BadInput, opts?.displayMessage, opts?.content);
    }
}

export class AuthenticationError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(
            opts?.status ?? 401,
            opts?.errorMessage ?? 'Authentication failed',
            opts?.errorCode ?? APIErrorCode.NotAuthenticated,
            opts?.displayMessage,
            opts?.content
        );
    }
}

export class ForbiddenError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(opts?.status ?? 403, opts?.errorMessage ?? 'Not authorized', opts?.errorCode ?? APIErrorCode.Forbidden, opts?.displayMessage, opts?.content);
    }
}

export class NotFoundError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(opts?.status ?? 404, opts?.errorMessage ?? 'Not found', opts?.errorCode ?? APIErrorCode.NotFound, opts?.displayMessage, opts?.content);
    }
}

export class ConflictError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(opts?.status ?? 409, opts?.errorMessage ?? 'Conflict', opts?.errorCode ?? APIErrorCode.Conflict, opts?.displayMessage, opts?.content);
    }
}

export class DuplicateError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(
            opts?.status ?? 409,
            opts?.errorMessage ?? 'Duplicate entry not allowed',
            opts?.errorCode ?? APIErrorCode.Duplicate,
            opts?.displayMessage,
            opts?.content
        );
    }
}

export class RateLimitError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(
            opts?.status ?? 429,
            opts?.errorMessage ?? 'Too Many Requests',
            opts?.errorCode ?? APIErrorCode.RateLimit,
            opts?.displayMessage ?? 'You have made too many attempts. Please try again later.'
        );
    }
}

export class InternalServerError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(
            opts?.status ?? 500,
            opts?.errorMessage ?? 'An unexpected error occurred',
            opts?.errorCode ?? APIErrorCode.InternalServer,
            opts?.displayMessage,
            opts?.content
        );
    }
}

export class ServerUnavailableError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(
            opts?.status ?? 502,
            opts?.errorMessage ?? 'The server is unavailable',
            opts?.errorCode ?? APIErrorCode.Unavailable,
            opts?.displayMessage,
            opts?.content
        );
    }
}

export class UnknownError extends APIError {
    constructor(opts?: ErrorOptions) {
        super(
            opts?.status ?? 500,
            opts?.errorMessage ?? 'An unknown error occurred',
            opts?.errorCode ?? APIErrorCode.Unknown,
            opts?.displayMessage,
            opts?.content
        );
    }
}
