import { AuthService } from "../auth/auth.service";
import { Body, Controller, Post, HttpStatus, HttpException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: "The user has been successfully created." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "User already exists." })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    const createdUser = await this.usersService.create(createUserDto);
    const token = await this.authService.createToken(createdUser);
    return { user: createdUser, token };
  }

  @Post("login")
  @ApiOperation({ summary: "Log in a user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: "Login successful, token returned." })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Invalid email or password." })
  async login(@Body() loginUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await user.comparePassword(loginUserDto.password);
    if (!isPasswordValid) {
      throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.createToken(user);
    return { user, token };
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset a user's password" })
  @ApiResponse({ status: HttpStatus.OK, description: "Password reset successfully." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid or expired token." })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    try {
      await this.usersService.resetPassword(body.token, body.newPassword);
      return {
        message: "Password reset successfully."
      };
    } catch (error) {
      throw new HttpException("Invalid or expired token.", HttpStatus.UNAUTHORIZED);
    }
  }
}
