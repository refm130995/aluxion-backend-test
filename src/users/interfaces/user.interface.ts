import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
