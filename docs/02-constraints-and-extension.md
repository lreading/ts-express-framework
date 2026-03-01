# Constraints and Extension

## Implicit rules

1. **Zero-arg constructor:** The class passed to `registerControllers` must be constructible with `new ControllerClass()`. Enforced via `design:paramtypes`; base classes may have parameters if the registered subclass supplies them.
2. **Return `null` → 404.** No other special return values.
3. **Response body = return value.** No standard envelope; `toResponse` uses `res.status(code).json(data)`.
4. **Path building:** `fullPath = (prefix.startsWith('/') ? '' : '/') + prefix + route.path`. Use leading slashes consistently (e.g. `@Get('/:id')`).
5. **RBAC:** Applied only when `allowedRoles` is non-empty and `allowAnonymous` is false. Requires `req.user.roleNames`.
6. **One instance per controller class** for the app lifetime.
7. **Verb decorators:** Second argument (options) is required by the decorator signature; all fields inside it are optional.

## Extending

- **Auth:** Supply your own `authMiddleware`; set `req.user` for RBAC. No framework change needed.
- **New routes/controllers:** Add classes and pass them in `controllers`. No framework change.
- **Custom error types:** Subclass `ApiError`, implement `logMessage(logger)`. Treated as 500 unless you fork/patch `getErrorResponse` in the framework.
- **Swagger:** Post-process the generated file or extend `SwaggerJsonGenerator` and call it after registration.

## Do not

- Add constructor parameters expecting the framework to inject them.
- Call `res.status()` / `res.json()` for the success path and also return a value (double-send).
- Rely on Express error middleware for route errors; the wrapper catches and responds.
- Overwrite metadata keys `'prefix'` or `'routes'` on the controller constructor.
