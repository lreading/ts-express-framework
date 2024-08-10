# ts-express-framework

An opinionated TypeScript framework for quickly bootstrapping REST APIs in NodeJS/TypeScript/Express.

## How is it opinionated?

- Designed for Typescript
- Uses decorators to define controllers and routes
- Controllers are classes, methods are routes
- Controllers _must_ have a constructor that does not take any arguments

## Features

- Role-based access control
- Easy integration with any authentication framework that uses standard Express middleware
- Swagger documentation generation

## Installation

```bash
npm install -S @lreading/ts-express-framework
```

## Basic Usage

Controller & Route:

```typescript
import { Controller, Get } from '@lreading/ts-express-framework';

@Controller('/hello')
export class HelloController {
  @Get('/', {
    summary: 'Hello, World!', // Swagger doc, optional
    description: 'A simple hello world route.', // Swagger doc, optional
    exampleResponse: 'Hello, World!', // Swagger doc, optional
    allowAnonymous: true, // Allow unauthenticated users to access this route
})
  async helloWorld(req, res) {
    // Return whatever type/object you want.
    // This will be wrapped into a response object:
    // { data: <your return value> }
    return 'Hello, World!';
  }

  @Post('/some-data', {
    summary: 'Posts some data',
    allowAnonymous: false,
    description: 'Creates the some data entity or something',
    bodyDefinition: { // Swagger doc, optional
      description: 'The data to post', // Swagger doc, optional
      required: true, // Swagger doc, optional
      example: { foo: 'bar' } // Swagger doc, optional
    },
    // Or, for query parameters:
    // params: [ // Swagger doc, optional
    //   {
    //      name: string;
    //      in: 'query' | 'path';
    //      required: boolean;
    //      type: 'boolean' | 'object' | 'number' | 'string' | 'integer';
    //      description?: string;
    //   }
    // ],
    exampleResponse: { // Swagger doc, optional
      foo: 'bar'
    },
    allowedRoles: ['admin'] // Only use if you've mapped the req.user.roleNames, see auth middleware section
  })
  asyn postData(req, res) {
    // Do something with the data
    return { foo: 'bar' };
  }
}
```

Server:

```typescript
import express from 'express';
import { registerControllers } from '@lreading/ts-express-framework';

import { HelloController } from './controllers/hello.controller';

const app = express();

registerControllers({
  app, // The express app

  // Array of controllers to register
  controllers: [HelloController],

  // Optional - location to save the swagger doc 
  swaggerDocLocation: 'swagger.json',

  // Optional - middleware to run for authorization.
  // See the note on authorization middleware if you intend to use RBAC
  authMiddleware: authMiddleware as any
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

## Auth Middleware

This framework expects the auth middleware to create a `User` object on the request. This object should have a `roleNames` property that is an array of strings. This is used for role-based access control. If you do not specify roles in your controller annotations, it will only do authentication, not authorization.

For more information on the user object, see the [User interface](src/entity/User.ts).

## Api Response / Errors

There is an ApiResponse wrapper that will take generate the status code and wrap whatever you're returning into the body of the request, such as this:

```typescript
{
  data: <your return value>
}
```

There are multiple API errors that map to common HTTP status codes. You can use these to return errors in your controllers. For example:

```typescript
import { BadRequestError } from '@lreading/ts-express-framework';

@Get('/some-route/{id}', {
  params: [{
    name: 'id',
    in: 'path',
    required: true,
    type: 'number',
    description: 'The ID of the thing'
  }]
})
async getSomeData(req, res) {
  if (!req.params.id) {
    throw new BadRequestError('ID is required');
  }
  // ... etc
}
```
