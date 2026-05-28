import type { AttributeAdminRepository } from "@/server/domain/repositories/attribute-admin.repository";
import type { AttributeAdminInput, AttributeValueAdminInput } from "@/server/domain/entities/attribute-admin.entity";

export class ListAttributesUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute() { return this.repo.listAttributes(); }
}

export class GetAttributeAdminUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(id: string) { return this.repo.findAttributeById(id); }
}

export class CreateAttributeUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(input: AttributeAdminInput) { return this.repo.createAttribute(input); }
}

export class UpdateAttributeUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(id: string, input: AttributeAdminInput) { return this.repo.updateAttribute(id, input); }
}

export class DeleteAttributeUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(id: string) { return this.repo.deleteAttribute(id); }
}

export class CreateAttributeValueUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(attributeId: string, input: AttributeValueAdminInput) { return this.repo.createAttributeValue(attributeId, input); }
}

export class UpdateAttributeValueUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(id: string, input: AttributeValueAdminInput) { return this.repo.updateAttributeValue(id, input); }
}

export class DeleteAttributeValueUseCase {
  constructor(private readonly repo: AttributeAdminRepository) {}
  execute(id: string) { return this.repo.deleteAttributeValue(id); }
}
