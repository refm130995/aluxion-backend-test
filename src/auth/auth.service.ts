import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(user: User) {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
