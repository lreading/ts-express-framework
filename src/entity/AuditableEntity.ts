import { User } from './User';

export interface AuditableEntity<T extends string | number> {
  id: T;
  createdBy: User<T>;
  created: Date;
  lastUpdatedBy: User<T>;
  updated: Date;
}
