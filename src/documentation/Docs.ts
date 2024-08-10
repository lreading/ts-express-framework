import fs from 'fs';
import { OpenAPIV3 } from 'openapi-types';

import { BodyDefinition, METHOD, ParamDefinition, RouteDefinition } from '../entity';
import { getResponses } from './responses';

// Example
// https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/api-with-examples.json
// https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore-expanded.json

export class SwaggerJsonGenerator {
  private readonly openApiVersion = '3.0.0';
  private readonly routes: RouteDefinition[];

  constructor(routes: RouteDefinition[]) {
    this.routes = routes;
  }

  private getInfoSection(): OpenAPIV3.InfoObject {
    return {
      title: process.env.npm_package_name,
      version: process.env.npm_package_version,
      description: process.env.npm_package_description,
      contact: {
        name: process.env.npm_package_author_name,
        email: process.env.npm_package_author_email
      },
      license: {
        name: process.env.npm_package_license
      }
    };
  }

  private getMethod(method: METHOD): string {
    switch (method) {
    case METHOD.DELETE:
      return 'delete';
    case METHOD.GET:
      return 'get';
    case METHOD.POST:
      return 'post';
    case METHOD.PUT:
      return 'put';
    default:
      throw new Error(`Unrecognized method: ${method}`);
    }
  }

  private getParams(params: ParamDefinition[]): OpenAPIV3.ParameterBaseObject[] {
    if (!params || params.length === 0) {
      return [];
    }

    const res: OpenAPIV3.ParameterObject[] = [];

    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      res.push({
        name: param.name,
        in: param.in,
        description: param.description || '',
        required: param.required,
        schema: {
          type: param.type
        }
      });
    }
    return res;
  }

  private objectToSchema(obj: Record<string, unknown>): OpenAPIV3.SchemaObject {
    const schema: OpenAPIV3.SchemaObject = {
      type: 'object',
      required: Object.keys(obj),
      properties: {}
    };

    for (const prop in obj) {
      schema.properties[prop] = {
        type: typeof obj[prop] as OpenAPIV3.NonArraySchemaObjectType
      };
    }

    return schema;
  }

  private getBody(body: BodyDefinition): OpenAPIV3.RequestBodyObject {
    return {
      description: body.description || '',
      required: body.required,
      content: {
        'application/json': {
          schema: this.objectToSchema(body.example)
        }
      }
    };
  }

  private getPath(route: RouteDefinition): OpenAPIV3.PathItemObject {
    const method = this.getMethod(route.method);

    const successResponse: OpenAPIV3.ResponseObject = {
      description: 'Success Response',
      content: {
        'application/json': {
          example: {
            status: 200,
            body: route.exampleResponse || {}
          }
        }
      }
    };

    const methodDef: Record<string, unknown> = {
      description: route.description || '',
      summary: route.summary || method,
      responses: getResponses(successResponse, route.method),
      tags: [route.prefix]
    };

    if (!!route.bodyDefinition && !!route.bodyDefinition.example) {
      methodDef.requestBody = this.getBody(route.bodyDefinition);
    }

    if (route.params) {
      methodDef.parameters = this.getParams(route.params);
    }

    return {
      [method]: methodDef
    };
  }

  private transformPathParams(path: string): string {
    return path
      .split('/')
      .map((x) => {
        if (x.startsWith(':')) {
          return `{${x.replace(':', '')}}`;
        }
        return x;
      })
      .join('/');
  }

  private getPathsSection(): OpenAPIV3.PathsObject {
    const paths: OpenAPIV3.PathsObject = {};
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const path = this.getPath(route);

      if (!paths[this.transformPathParams(route.fullPath)]) {
        paths[this.transformPathParams(route.fullPath)] = {};
      }
      paths[this.transformPathParams(route.fullPath)][route.method] = path[route.method];
    }
    return paths;
  }

  generate(filePath: string): void {
    const doc: OpenAPIV3.Document = {
      openapi: this.openApiVersion,
      info: this.getInfoSection(),
      paths: this.getPathsSection()
    };

    fs.writeFileSync(filePath, JSON.stringify(doc));
  }
}
