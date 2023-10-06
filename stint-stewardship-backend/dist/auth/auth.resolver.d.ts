import { AuthService } from './auth.service';
import { UserLoginInput } from './User-Login.input';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    userLogin(userLoginInput: UserLoginInput): Promise<{
        accessToken: string;
    }>;
}
