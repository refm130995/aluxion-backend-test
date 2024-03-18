import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The user's email address",
    required: true
  })
  readonly email: string;

  @ApiProperty({
    example: "StrongPassword123",
    description: "The user's password",
    required: true
  })
  readonly password: string;
}
