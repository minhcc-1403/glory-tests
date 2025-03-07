import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./schemas/token.schema";
import { TokenService } from "./token.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
    JwtModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
