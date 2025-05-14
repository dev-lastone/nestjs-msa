import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMicroservice } from '@app/common';

@Controller()
@UserMicroservice.UserServiceControllerMethods()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserInfo(req: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(req.userId);
  }
}
