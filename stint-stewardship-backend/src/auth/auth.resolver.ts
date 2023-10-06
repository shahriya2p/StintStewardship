import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginInput } from './User-Login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserLoginInput)
  async userLogin(
    @Args('loginUserInput') userLoginInput: UserLoginInput,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userLoginInput);
  }
}
