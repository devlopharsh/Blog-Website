export type PostStatus = "on" | "off";

export interface Post {
  _id: string;
  title: string;
  email: string;
  shortDescription: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PostsQuery {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
  category?: string;
  tags?: string;
}

export interface AuthUser {
  email: string;
  name?: string;
}

export interface PostPayload {
  title: string;
  shortDescription: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  imageUrl: string;
  status: PostStatus;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
}
