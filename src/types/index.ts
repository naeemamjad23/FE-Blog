export interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  _count?: { posts: number; series: number };
  subDomainCounts?: Record<string, number>;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  _count?: { posts: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: string;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  isPremium: boolean;
  isSponsored: boolean;
  sponsorName?: string;
  sponsorUrl?: string;
  domainId: string;
  domain: Domain;
  seriesId?: string;
  series?: Series;
  seriesOrder?: number;
  authorId: string;
  author: Author;
  tags: { tag: Tag }[];
  viewCount: number;
  readTimeMin?: number;
  _count?: { comments: number };
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  coverImage?: string;
  domainId: string;
  domain: Domain;
  posts?: Post[];
  _count?: { posts: number };
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source?: string;
  createdAt: string;
}

export interface LeadMagnet {
  id: string;
  title: string;
  slug: string;
  description: string;
  fileUrl: string;
  coverImage?: string;
  downloads: number;
}

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  postId: string;
  parentId?: string;
  approved: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  posts: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalyticsOverview {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalSubscribers: number;
  totalComments: number;
  pendingComments: number;
}
