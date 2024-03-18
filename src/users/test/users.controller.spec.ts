import { AuthService } from "../../auth/auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../interfaces/user.interface";

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
            resetPassword: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            createToken: jest.fn()
          }
        }
      ]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it("should successfully register a new user", async () => {
    const createUserDto: CreateUserDto = { email: "test@example.com", password: "123456" };
    const mockUser: Partial<User> & { _id: string; email: string; password: string } = {
      _id: "a unique id",
      email: "test@example.com",
      password: "123456",
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(usersService, "findOneByEmail").mockResolvedValue(null);
    jest.spyOn(usersService, "create").mockResolvedValue(mockUser as User);
    jest.spyOn(authService, "createToken").mockResolvedValue("a jwt token");

    const result = await usersController.register(createUserDto);

    expect(result.token).toBeDefined();
    expect(result.token).toEqual("a jwt token");
    expect(result.user._id).toBeDefined();

    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it("should successfully login a user", async () => {
    const loginUserDto: CreateUserDto = { email: "test@example.com", password: "123456" };
    const user = {
      ...loginUserDto,
      _id: "a unique id",
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(usersService, "findOneByEmail").mockResolvedValue(user as any);
    jest.spyOn(authService, "createToken").mockResolvedValue("a jwt token");

    const result = await usersController.login(loginUserDto);

    expect(result).toEqual({
      user,
      token: "a jwt token"
    });
    expect(user.comparePassword).toHaveBeenCalledWith("123456");
  });

  it("should reset a user password", async () => {
    jest.spyOn(usersService, "resetPassword").mockResolvedValue();
    const body = { token: "resetToken", newPassword: "newPassword" };

    const result = await usersController.resetPassword(body);
    expect(result.message).toEqual("Password reset successfully.");
    expect(usersService.resetPassword).toHaveBeenCalledWith(body.token, body.newPassword);
  });
});
