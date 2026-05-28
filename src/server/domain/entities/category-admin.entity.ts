export type CategoryAdminListItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
};

export type CategoryAdminDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type CategoryAdminInput = {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
};
