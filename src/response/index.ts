import { AcceptedResponse } from './Accepted';
import { BadRequestResponse } from './BadRequest';
import { CreatedResponse } from './Created';
import { ForbiddenResponse } from './Forbidden';
import { NoContentResponse } from './NoContent';
import { NotFoundResponse } from './NotFound';
import { OkResponse } from './Ok';
import { RedirectResponse } from './Redirect';
import { ServerErrorResponse } from './ServerError';
import { UnauthorizedResponse } from './Unauthorized';

export const accepted = (body: any) => new AcceptedResponse(body);
export const badRequest = (errorMessage?: string) => new BadRequestResponse(errorMessage);
export const created = (body: any) => new CreatedResponse(body);
export const forbidden = () => new ForbiddenResponse();
export const noContent = () => new NoContentResponse();
export const notFound = () => new NotFoundResponse();
export const ok = (body: any) => new OkResponse(body);
export const redirect = (location: string) => new RedirectResponse(location);
export const serverError = () => new ServerErrorResponse();
export const unauthorized = () => new UnauthorizedResponse();

export * from './ApiResponse';

export default {
  accepted,
  badRequest,
  created,
  forbidden,
  noContent,
  notFound,
  ok,
  redirect,
  serverError,
  unauthorized
};
