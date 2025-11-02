import { API_BASE } from "@/lib/config";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  nickName: string;
  status: "ONLINE" | "OFFLINE" | string;
}

/**
 * Fetch all connected users from the backend
 */
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch a specific user by nickname
 */
export async function fetchUserByNickname(nickName: string): Promise<User | null> {
  const response = await fetch(`${API_BASE}/user/${nickName}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data || null;
}

/**
 * Fetch a specific user by ID
 */
export async function fetchUserById(userId: number): Promise<User | null> {
  const response = await fetch(`${API_BASE}/user/id/${userId}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data || null;
}