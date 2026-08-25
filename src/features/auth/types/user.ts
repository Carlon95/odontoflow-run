export type UserRole = "Admin" | "Dentista";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  createdAt: string;
  updatedAt: string;
}
