import { User } from './User';

export interface AuditableEntity<T extends string | number> {
  id: T;
  createdBy: User<T>;
  createdDate: Date;
  lastModifiedBy: User<T>;
  lastModifiedDate: Date;

  getValidationErrors(): Promise<string>;
}
