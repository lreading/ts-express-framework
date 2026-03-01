# Internal Framework Documentation

Authoritative docs for **@lreading/ts-express-framework**. Aligned with real usage (e.g. Riskize API). Suitable for maintainers and for AI/agents that need to reason about or use the framework.

---

## Document index

| Doc | Contents |
|-----|----------|
| [01-framework-reference.md](01-framework-reference.md) | Bootstrap, controllers, response/status, errors, middleware, Swagger. Examples from real usage. |
| [02-constraints-and-extension.md](02-constraints-and-extension.md) | Implicit rules, extension points, what not to do. |
| [03-project-and-testing.md](03-project-and-testing.md) | Project layout (Riskize-style), testing controllers and middleware. |

---

## Quick reference for agents

- **Bootstrap:** `registerControllers({ app, controllers, swaggerDocLocation?, authMiddleware })`. `authMiddleware` is one function or an array. Call after creating the Express app; ensure controller classes are imported so decorators run.
- **Controllers:** Class with `@Controller(prefix)`, **zero-arg constructor**, methods with `@Get(path, options)`, `@Post(path, options)`, `@Put`, `@Patch`, `@Delete`. Options: `allowAnonymous`, `summary`, `description`, `bodyDefinition`, `exampleResponse`, `params`, `allowedRoles`. One instance per controller class.
- **Response:** Return value = response body. GET→200, POST→201, PUT→202, PATCH/DELETE→204; return `null` → 404. Errors: throw `BadRequestError(req, message)`, `NotFoundError(req)`, `UnauthorizedError(req)`, `ForbiddenError(req)`, `RedirectError(req, url)`, or other `ApiError` (→500).
- **No DI.** Controllers create services in the constructor (e.g. `new MyService()`). Registered class may extend a base with constructor args if the subclass has a no-arg constructor that calls `super(...)`.
- **Metadata:** `'prefix'`, `'routes'` on controller constructor; `design:paramtypes` must be empty for the registered class. `RedirectError.redirectLocation` is the redirect URL.
