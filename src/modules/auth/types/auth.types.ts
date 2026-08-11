import type { UserRoleType } from "@/config/enums"

export interface User {
  id: string
  email: string
  name: string
  role: UserRoleType
}

export interface LoginCredentials {
  email: string
  password?: string
}

export interface AuthResponse {
  user: User
  token: string
}