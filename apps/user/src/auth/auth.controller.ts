import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(token: string, @Body() registerDto: RegisterDto) {
    if (token === null) {
      throw new UnauthorizedException('Token is required');
    }

    // return this.authService.register(token, registerDto);
  }
}
