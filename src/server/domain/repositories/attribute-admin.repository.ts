import type {
  AttributeAdminListItem,
  AttributeAdminDetail,
  AttributeAdminInput,
  AttributeValueAdminInput,
} from "../entities/attribute-admin.entity";

export interface AttributeAdminRepository {
  listAttributes(): Promise<AttributeAdminListItem[]>;
  findAttributeById(id: string): Promise<AttributeAdminDetail | null>;
  createAttribute(input: AttributeAdminInput): Promise<{ id: string }>;
  updateAttribute(id: string, input: AttributeAdminInput): Promise<void>;
  deleteAttribute(id: string): Promise<void>;
  createAttributeValue(attributeId: string, input: AttributeValueAdminInput): Promise<{ id: string }>;
  updateAttributeValue(id: string, input: AttributeValueAdminInput): Promise<void>;
  deleteAttributeValue(id: string): Promise<void>;
}
