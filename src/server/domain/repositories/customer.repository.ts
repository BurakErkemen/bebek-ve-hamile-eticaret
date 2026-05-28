import type {
  Customer,
  CustomerWithPassword,
} from "@/server/domain/entities/customer.entity";

export interface CustomerRepository {
  findByEmail(email: string): Promise<CustomerWithPassword | null>;
  findById(id: string): Promise<Customer | null>;
  create(input: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<Customer>;
}
