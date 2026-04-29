import axios from "axios";

import type {
  LoginPayload,
  Post,
  PostPayload,
  PostsQuery,
  PostsResponse,
  SignupPayload,
} from "@/lib/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("blog-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export async function login(payload: LoginPayload) {
  const response = await api.post<{ success: boolean; token: string }>(
    "/auth/login",
    payload,
  );

  return response.data;
}

export async function signup(payload: SignupPayload) {
  const response = await api.post<{ success: boolean; message: string }>(
    "/auth/signup",
    payload,
  );

  return response.data;
}

export async function getPosts(query: PostsQuery = {}) {
  const response = await api.get<{ success: boolean } & PostsResponse>("/posts", {
    params: query,
  });

  return response.data;
}

export async function getPost(id: string) {
  const response = await api.get<{ success: boolean; data: Post }>(`/posts/${id}`);
  return response.data.data;
}

export async function createPost(payload: PostPayload) {
  const response = await api.post<{ success: boolean; data: Post }>("/posts", payload);
  return response.data.data;
}

export async function updatePost(id: string, payload: PostPayload) {
  const response = await api.put<{ success: boolean; data: Post }>(
    `/posts/${id}`,
    payload,
  );

  return response.data.data;
}

export async function deletePost(id: string) {
  await api.delete(`/posts/${id}`);
}

export async function exportCSV(query: PostsQuery = {}) {
  const response = await api.get("/posts/export", {
    params: query,
    responseType: "blob",
  });

  return response.data as Blob;
}
