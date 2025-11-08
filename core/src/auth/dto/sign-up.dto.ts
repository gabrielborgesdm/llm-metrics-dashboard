import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/user.constants';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address (must be unique)'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password (minimum 4 characters)',
    minLength: 4
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.MEMBER,
    description: 'User role',
    default: UserRole.MEMBER
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}