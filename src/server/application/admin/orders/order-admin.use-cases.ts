import type { OrderAdminRepository } from "@/server/domain/repositories/order-admin.repository";
import type { OrderAdminStatus, OrderStatusUpdateInput } from "@/server/domain/entities/order-admin.entity";

export class ListOrdersUseCase {
  constructor(private readonly repo: OrderAdminRepository) {}
  execute(filter?: { status?: OrderAdminStatus }) { return this.repo.listOrders(filter); }
}

export class GetOrderAdminUseCase {
  constructor(private readonly repo: OrderAdminRepository) {}
  execute(id: string) { return this.repo.findOrderById(id); }
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly repo: OrderAdminRepository) {}
  execute(id: string, input: OrderStatusUpdateInput) { return this.repo.updateOrderStatus(id, input); }
}
