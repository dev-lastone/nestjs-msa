import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMicroservice } from '@app/common';
import { GrpcInterceptor } from '@app/common/interceptor';

@Controller('auth')
@UserMicroservice.AuthServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // @UsePipes(ValidationPipe)
  // registerUser(
  //   @Authorization() token: string,
  //   @Body() registerDto: RegisterDto,
  // ) {
  //   if (token === null) {
  //     throw new UnauthorizedException('Token is required');
  //   }
  //
  //   return this.authService.register(token, registerDto);
  // }

  // @Post('login')
  // @UsePipes(ValidationPipe)
  // loginUser(@Authorization() token: string) {
  //   if (token === null) {
  //     throw new UnauthorizedException('Token is required');
  //   }
  //
  //   return this.authService.login(token);
  // }

  parseBearerToken(payload: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(payload.token, false);
  }

  registerUser(req: UserMicroservice.RegisterUserRequest) {
    const token = req.token;

    if (token === null) {
      throw new UnauthorizedException('Token is required');
    }

    return this.authService.register(token, req);
  }

  loginUser(req: UserMicroservice.LoginUserRequest) {
    const token = req.token;

    if (token === null) {
      throw new UnauthorizedException('Token is required');
    }

    return this.authService.login(token);
  }
}
