import { EmailService } from "../email/email.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./interfaces/user.interface";
@Injectable()
export class UsersService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly emailService: EmailService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email }).exec();
  }

  // Con esta implementacion crea un token y envia un correo con un link con una duracion de 1hr para que el usuario pueda cambiar su contraseña
  // async requestPasswordReset(email: string): Promise<string> {
  //   const user = await this.userModel.findOne({ email });
  //   if (!user) {
  //     throw new Error("No account found with that email address.");
  //   }

  //   const buffer = crypto.randomBytes(20);
  //   const token = buffer.toString("hex");

  //   user.passwordResetToken = token;
  //   user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  //   await user.save();

  //   await this.emailService.sendPasswordResetEmail(user.email, token);

  //   return token;
  // }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error("Password reset token is invalid or has expired.");
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // No poseo keys para implementacion correcta de cliente de correos (nodemailer) con 0Auth
    // this.emailService.sendMail(
    //   user.email,
    //   "PASSWORD RESET",
    //   "Password reset successfully",
    //   `<p>Your password has been reset</p>`
    // );
  }
}
