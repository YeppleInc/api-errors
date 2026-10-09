import {
    APIError,
    APIErrorCode,
    AuthenticationError,
    BadInputError,
    ConflictError,
    DuplicateError,
    ErrorOptions,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    RateLimitError,
    ServerUnavailableError,
    UnknownError
} from './errors.js';

interface Response {
    readonly ok: boolean;
    readonly status: number;
    json(): Promise<any>;
}

/**
 * Parse an API Response into an APIError of the appropriate class.
 *
 * IMPORTANT: type conversions assume that the server utilizes this library for error generation
 *
 * @param resp the server Response containing a potential APIError
 * @returns the APIError (as an instance of the appropriate sub-class) represented in the Response if it exists, otherwise undefined
 */
export async function parseError(resp: Response): Promise<APIError | undefined> {
    if (resp.ok) return undefined;

    const body = (await resp.json().catch(() => {
        // The error response did not contain any JSON content
        return undefined;
    })) as ErrorOptions;
    if (body === undefined || body.errorCode === undefined) return undefined;

    const params = { status: resp.status, ...body };
    switch (body.errorCode) {
        case APIErrorCode.BadInput:
            return new BadInputError(params);
        case APIErrorCode.NotAuthenticated:
            return new AuthenticationError(params);
        case APIErrorCode.Forbidden:
            return new ForbiddenError(params);
        case APIErrorCode.NotFound:
            return new NotFoundError(params);
        case APIErrorCode.Conflict:
            return new ConflictError(params);
        case APIErrorCode.Duplicate:
            return new DuplicateError(params);
        case APIErrorCode.RateLimit:
            return new RateLimitError(params);
        case APIErrorCode.InternalServer:
            return new InternalServerError(params);
        case APIErrorCode.Unavailable:
            return new ServerUnavailableError(params);
        case APIErrorCode.Unknown:
            return new UnknownError(params);
        default:
            return new UnknownError(params);
    }
}
