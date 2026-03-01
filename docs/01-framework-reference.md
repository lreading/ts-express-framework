# Framework Reference

Single reference for **@lreading/ts-express-framework**: bootstrap, controllers, responses, errors, middleware, Swagger. Aligned with real usage (e.g. Riskize API).

---

## Bootstrap

- **Entry:** Call `registerControllers(config)` with your Express app. You create the app yourself; the framework only registers routes and optional Swagger.
- **reflect-metadata:** Must run before decorators. Import from `@lreading/ts-express-framework` before loading controller classes (the package imports `reflect-metadata` at entry).

**Config:**

| Key | Required | Description |
|-----|----------|-------------|
| `app` | Yes | Express instance |
| `controllers` | Yes | Array of controller **classes** (not instances) |
| `authMiddleware` | Yes | One middleware function or **array** of middleware functions |
| `swaggerDocLocation` | No | If set, writes OpenAPI 3.0 JSON to this path |

**Example (Riskize-style):**

```ts
import { Express } from 'express';
import { registerControllers } from '@lreading/ts-express-framework';
import { AuthController } from './Auth';
import { ProjectController } from './Project';
// ... other controllers
import { isAuthenticated } from '../middleware';
import { csrfSynchronisedProtection } from '../util';

export const addRoutes = (app: Express): void => {
  registerControllers({
    app,
    controllers: [AuthController, ProjectController, /* ... */],
    swaggerDocLocation: 'swagger.json',
    authMiddleware: [isAuthenticated, csrfSynchronisedProtection],
  });
};
```

---

## Controllers

- **Class** with `@Controller(prefix)`. Prefix is a path segment (e.g. `'/api/v1/projects'`). Default `''`.
- **Constructor:** Must take **zero arguments**. The class you pass to `registerControllers` must be instantiable with `new ControllerClass()`. You may extend a base class whose constructor takes arguments, as long as the **registered** class has a no-arg constructor that supplies them (e.g. `constructor() { super(Entity, new EntityService()); }`).
- **Routes:** Methods decorated with `@Get(path, options)`, `@Post(path, options)`, `@Put`, `@Patch`, `@Delete`. Path is Express-style (e.g. `'/'`, `'/:id'`, `'/:projectId/alternatives'`).
- **Handler signature:** Method is called with `(req, res)`. You may omit `res` if unused. Return value becomes the response body; throw framework errors for error responses. Do not call `res.status()` / `res.json()` for the normal success path—the framework does that.

**Route options (all optional):**

| Option | Purpose |
|--------|---------|
| `allowAnonymous` | If true, auth middleware is skipped for this route |
| `summary` | OpenAPI operation summary |
| `description` | OpenAPI operation description |
| `bodyDefinition` | `{ description?, required?, example }` for request body in Swagger |
| `exampleResponse` | Example success body for Swagger (and documentation) |
| `params` | `[{ name, in: 'path' \| 'query', required, type, description? }]` for Swagger |
| `allowedRoles` | RBAC: user must have one of these roles (`req.user.roleNames`); only applied when `allowAnonymous` is false |

**Minimal controller (anonymous GET):**

```ts
@Controller('/api/v1/config')
export class ConfigController {
  @Get('/', {
    allowAnonymous: true,
    summary: 'System Configuration',
    description: 'Gets the configuration for the UI',
    exampleResponse: { someConfig: 'value' },
  })
  async getConfig() {
    return ConfigResponse.fromConfig();
  }
}
```

**Controller with auth and body (Riskize-style):**

```ts
@Controller('/api/v1/auth')
export class AuthController {
  constructor() {
    // No DI: instantiate services in constructor if needed
    this.userService = new AppUserService();
  }

  @Post('/register', {
    allowAnonymous: true,
    summary: 'Register a new user',
    bodyDefinition: { description: 'Registration Body', required: true, example: { email: 'a@b.com', password: 'p', confirmPassword: 'p' } },
    exampleResponse: { id: 1, email: 'nobody@nowhere.com' },
  })
  async register(req: Request) {
    if (!req.body.password || req.body.password !== req.body.confirmPassword) {
      throw new BadRequestError(req, 'Password and confirm password must match');
    }
    const entity = await this.userService.create(/* ... */);
    return { id: entity.id, email: entity.email };
  }
}
```

**Resource controller extending a base (Riskize-style):**

```ts
@Controller('/api/v1/projects')
export class ProjectController extends EntityController<Project> {
  constructor() {
    super(Project, new ProjectService());
  }

  @Get('/', { summary: 'Get all projects', exampleResponse: [/* ... */] })
  async getAll(req: Request) {
    return await super.getAll(req);
  }

  @Get('/:id', {
    params: [{ name: 'id', in: 'path', required: true, type: 'number', description: 'Project ID' }],
    exampleResponse: { id: 1, name: 'Project 1', /* ... */ },
  })
  async getById(req: Request) {
    return await super.getById(req);
  }

  @Post('/', { bodyDefinition: { required: true, example: { name: 'Project 1', /* ... */ } }, exampleResponse: { id: 1, /* ... */ } })
  async insert(req: Request) {
    return await super.insert(req);
  }

  @Put('/:id', { params: [/* ... */], bodyDefinition: { required: true, example: { id: 1, /* ... */ } } })
  async update(req: Request) {
    return await super.update(req);
  }

  @Delete('/:id', { params: [{ name: 'id', in: 'path', required: true, type: 'number' }] })
  async delete(req: Request) {
    return await super.delete(req);
  }
}
```

---

## Response and status codes

- **Success:** The framework maps return value and HTTP method to status and sends JSON.
  - **GET:** 200, body = return value.
  - **POST:** 201 Created, body = return value.
  - **PUT:** 202 Accepted, body = return value.
  - **PATCH / DELETE:** 204 No Content (body not sent).
  - **Return `null`:** 404 Not Found.
- **Body:** Response body is the raw return value (no envelope like `{ data }`). Use `res.status().json(data)` only for success; do not mix with returning a value.

---

## Errors

Throw framework error classes. The wrapper catches them and sends the corresponding HTTP response. Pass `req` into each so logging has method, path, and optional user.

| Error | Status | Usage |
|-------|--------|--------|
| `BadRequestError` | 400 | `throw new BadRequestError(req, 'message')` |
| `UnauthorizedError` | 401 | `throw new UnauthorizedError(req)` |
| `ForbiddenError` | 403 | `throw new ForbiddenError(req)` |
| `NotFoundError` | 404 | `throw new NotFoundError(req)` |
| `RedirectError` | 302 | `throw new RedirectError(req, redirectUrl)`; URL on `RedirectError.redirectLocation` |
| Other `ApiError` / non-ApiError | 500 | Generic server error |

Errors can be thrown from controllers or from services called by controllers; the wrapper still turns them into HTTP responses. Do not throw plain `Error` for client errors—use `BadRequestError` etc., or the response will be 500.

---

## Middleware

- **Per-route:** Each route gets middleware composed by the framework: either pass-through only (`allowAnonymous: true`) or `authMiddleware` then optional RBAC.
- **Auth:** Your `authMiddleware` runs for every non-anonymous route. It should set `req.user` (and optionally send 401). For RBAC, `req.user` must have `roleNames: string[]`; the framework checks it against `allowedRoles` when that option is set.
- **Order:** auth (all functions in `authMiddleware`) → RBAC (if `allowedRoles` set and not anonymous) → route handler. The framework does not attach controller-level middleware; only route-level.

---

## Swagger / OpenAPI

- **Source:** Route metadata from decorators (`summary`, `description`, `exampleResponse`, `bodyDefinition`, `params`). No separate DSL.
- **When:** If `swaggerDocLocation` is provided, the framework writes the OpenAPI document after registering all routes. Path params in routes use Express style (`:id`); the doc uses OpenAPI style (`{id}`).
- **You must supply:** `summary`, `description`, `exampleResponse`, `bodyDefinition`, `params` in decorator options for them to appear; types are not inferred.

---

## Quick reference (agents)

- **Bootstrap:** `registerControllers({ app, controllers, swaggerDocLocation?, authMiddleware })`. `authMiddleware` can be a single function or array.
- **Controllers:** Class with `@Controller(prefix)`, zero-arg constructor, methods with `@Get(path, options)` etc. One instance per controller class for app lifetime.
- **Response:** Return value → body; GET→200, POST→201, PUT→202, PATCH/DELETE→204; `null`→404. Errors by throwing `BadRequestError(req, message)`, `NotFoundError(req)`, etc.
- **No built-in DI.** Services are typically created in the controller constructor (`new MyService()`). Base classes with constructor args are fine if the registered subclass has a no-arg constructor.
