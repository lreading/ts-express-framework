# Project Structure and Testing

## Project structure (aligned with real usage)

Typical layout for an app using this framework:

```
src/
  controller/
    index.ts          # addRoutes(app): imports all controllers, calls registerControllers({ app, controllers, swaggerDocLocation, authMiddleware })
    Auth.ts
    Project.ts
    EntityController.ts   # Optional base class for CRUD; registered controllers extend it with super(Entity, new EntityService())
  middleware/
    auth.ts           # e.g. isAuthenticated: check req.session.user, 401 or next()
  service/
  entity/
  ...
swagger.json          # Generated when swaggerDocLocation is set
```

- **Bootstrap:** One function (e.g. `addRoutes(app)`) that receives the Express app and calls `registerControllers` with the controller class array and auth middleware. The app is created elsewhere (e.g. server entry); routes are attached by calling this function.
- **Controllers:** One file per controller (or per feature). Export the class; import all of them in the bootstrap file so decorators run and the classes are passed to `registerControllers`.
- **Auth:** Middleware can use sessions (`req.session.user`) or JWT; for RBAC the framework expects `req.user.roleNames`. If you only use `allowAnonymous` vs authenticated, you do not need to set `req.user`.

## Testing

- **Handlers:** Instantiate the controller, call the method with mock `req` and `res`, assert on return value or thrown errors. Ensure `reflect-metadata` is loaded if tests touch registration or metadata.
- **Errors:** Use framework error classes in tests as in production; assert that the correct status/body are sent (e.g. via integration tests against a test app) or mock the response layer.
- **Services:** Not managed by the framework; test as usual. Controllers can be tested with service mocks (e.g. replace the service module or inject test doubles via a pattern you own).
- **Middleware:** Test auth and RBAC in isolation with mock `req`/`res`/`next`; optionally run integration tests with the real stack.
