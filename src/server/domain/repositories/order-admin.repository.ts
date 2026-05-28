import type {
  OrderAdminListItem,
  OrderAdminDetail,
  OrderStatusUpdateInput,
  OrderAdminStatus,
} from "../entities/order-admin.entity";

export interface OrderAdminRepository {
  listOrders(filter?: { status?: OrderAdminStatus }): Promise<OrderAdminListItem[]>;
  findOrderById(id: string): Promise<OrderAdminDetail | null>;
  updateOrderStatus(id: string, input: OrderStatusUpdateInput): Promise<void>;
}
