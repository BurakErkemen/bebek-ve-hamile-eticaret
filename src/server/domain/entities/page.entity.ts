export type PageDetail = {
  id: string;
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  sortOrder: number;
};

export type PageInput = {
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  sortOrder: number;
};

export type CorporatePageStatus = {
  slug: string;
  isActive: boolean;
  hasContent: boolean;
};
