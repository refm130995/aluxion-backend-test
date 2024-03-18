import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'The password of the user',
    required: true,
  })
  readonly password: string;
}
