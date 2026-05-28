export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  sortOrder: number;
};

export type BlogPostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  sortOrder: number;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  sortOrder: number;
};
