export interface ParamDefinition {
  name: string;
  in: 'query' | 'path';
  required: boolean;
  type: 'boolean' | 'object' | 'number' | 'string' | 'integer';
  description?: string;
}
