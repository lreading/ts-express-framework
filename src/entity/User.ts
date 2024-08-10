export interface User<T extends string | number> {
  id: T;
  roleNames: string[];
  firstName: string;
  lastName: string;
  email: string;
}
