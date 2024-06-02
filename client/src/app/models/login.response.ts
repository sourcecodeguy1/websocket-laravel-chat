import { User } from "./user";

export interface LoginResponse {
    message: string;
    id: string;
    user: User;
  }
  