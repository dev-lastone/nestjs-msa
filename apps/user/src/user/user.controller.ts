import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMicroservice } from '@app/common';
import { GrpcInterceptor } from '@app/common/interceptor';

@Controller()
@UserMicroservice.UserServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserInfo(req: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(req.userId);
  }
}
