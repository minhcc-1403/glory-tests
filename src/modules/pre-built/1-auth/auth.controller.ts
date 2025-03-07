import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { GetDecodedToken } from "~common/decorators/get-decoded-token.decorator";
import { Public } from "~decorators/public.decorator";
import { DecodedToken } from "~modules/pre-built/5-tokens/interface";
import { AuthService } from "./auth.service";
import { EmailDto } from "./dto/email.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordWithOtpDto } from "./dto/password-with-otp.dto";
import { ResetPasswordWithTokenDto } from "./dto/password-with-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { SocialLoginDto } from "./dto/social-login.dto";
import { TokenDto } from "./dto/token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //  ----- Method: POST -----
  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Get("tokens")
  @HttpCode(HttpStatus.OK)
  async getTokens() {
    return this.authService.getTokens();
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post("social_login")
  @HttpCode(HttpStatus.OK)
  async socialLogin(@Body() body: SocialLoginDto) {
    return this.authService.socialLogin(body);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post("send_token")
  async sendToken(@Body() body: RegisterDto) {
    return this.authService.sendToken(body);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @Post("activate_token")
  async activateToken(@Body() { token }: TokenDto) {
    return this.authService.activateToken(token);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetDecodedToken() decodedToken: DecodedToken, @Body("fcmToken") fcmToken?: string) {
    return this.authService.logout(decodedToken, fcmToken);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post("refresh_token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() { token, fcmToken }: TokenDto) {
    return this.authService.refreshToken(token, fcmToken);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post("forgot_password")
  @HttpCode(HttpStatus.OK)
  async sendForgotPassword(@Body() { email }: EmailDto) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post("reset_password/token")
  @HttpCode(HttpStatus.OK)
  async resetPasswordByToken(@Body() body: ResetPasswordWithTokenDto) {
    return this.authService.resetPasswordWithToken(body);
  }

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post("reset_password/otp")
  @HttpCode(HttpStatus.OK)
  async resetPasswordByOtp(@Body() body: ResetPasswordWithOtpDto) {
    return this.authService.resetPasswordWithOtp(body);
  }
}
