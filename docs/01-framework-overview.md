# Framework Overview

## Purpose

**@lreading/ts-express-framework** is an opinionated TypeScript framework for bootstrapping REST APIs on Node.js using Express. It provides decorator-based controller and route definition, convention-based HTTP status mapping, built-in error translation, role-based access control (RBAC), and optional Swagger/OpenAPI document generation.

**Source:** `package.json` (description), `README.md`.

---

## Design Philosophy

1. **Decorator-driven API surface**  
   Controllers and routes are defined via class and method decorators. Metadata is stored with `reflect-metadata` and read at startup when routes are registered.

2. **Zero-argument controllers**  
   Controllers must be constructible with `new ControllerClass()` and no arguments. The framework does not provide dependency injection; it instantiates each controller once per application lifecycle. See [Dependency Injection & Services](05-dependency-injection-services.md).

3. **Return value as response body**  
   Handler methods return domain values (objects, primitives, or `null`). The framework maps return values and HTTP verbs to status codes and sends JSON. Controllers do not call `res.status()` or `res.json()` directly for success paths.

4. **Exception-based error signaling**  
   Errors are signaled by throwing framework error classes (e.g. `BadRequestError`, `NotFoundError`). The framework catches these and converts them to HTTP responses with appropriate status and body.

5. **Middleware-compatible**  
   Authentication and other cross-cutting concerns are delegated to Express middleware. The framework expects an `authMiddleware` that populates `req.user` for RBAC. Route registration composes this middleware with optional RBAC checks.

6. **Swagger as a side effect of registration**  
   OpenAPI 3.0 documentation is generated from the same route metadata used for registration, written to a file when `swaggerDocLocation` is provided. No separate DSL is required; decorator options drive the docs.

---

## What Problems It Solves

- **Consistent REST semantics:** Standard mapping of HTTP verb + return value to status codes (e.g. POST → 201 Created, GET → 200 OK, DELETE/PATCH → 204 No Content).
- **Centralized error handling:** One place (the wrapper in `RequestDecorator`) where `ApiError` subclasses are translated to HTTP status and body.
- **RBAC without boilerplate:** Declarative `allowedRoles` and `allowAnonymous` on routes; the framework composes auth middleware and RBAC middleware.
- **Documentation from code:** OpenAPI document generated from route definitions, including summary, description, example response, body definition, and parameters.

---

## What Opinions It Enforces

| Opinion | Enforcement |
|--------|-------------|
| Controllers are classes with a no-arg constructor | `init.ts` checks `design:paramtypes` and throws if the controller has constructor parameters. |
| Routes are class methods decorated with `@Get`, `@Post`, etc. | Only methods with these decorators are registered; metadata key is `'routes'`. |
| Success response shape is determined by HTTP verb and return value | `getResponseWrapper()` in `src/decorators/Request.ts` maps verb + body to `ApiResponse` (e.g. POST → Created, GET → Ok). |
| Returning `null` means 404 | `getResponseWrapper` returns `response.notFound()` when `body === null`. |
| Errors are thrown, not returned | Only thrown `ApiError` (and subclasses) are converted to error responses; non-`ApiError` throwables become 500. |
| Auth is middleware; user is on `req.user` | RBAC and docs assume `User` with `roleNames`; see `types/express/index.d.ts` and `src/entity/User.ts`. |
| Response body is JSON | `ApiResponse.toResponse()` uses `res.status(code).json(data)`; `RedirectResponse` overrides to use `res.redirect()`. |

---

## Key Files

- **Bootstrap:** `src/init.ts` — `registerControllers()`, controller instantiation, route registration, middleware composition, optional Swagger generation.
- **Decorators:** `src/decorators/Controller.ts`, `src/decorators/Request.ts`, `src/decorators/Get.ts` (and other verbs).
- **Metadata keys:** `'prefix'` (controller), `'routes'` (array of `RouteDefinition`).
- **Entry point:** `src/index.ts` — re-exports and `import 'reflect-metadata'`.
