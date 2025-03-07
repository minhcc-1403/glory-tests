import { forwardRef, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleModule } from "~modules/pre-built/2-roles/role.module";
import { HashingService } from "./hashing/hashing.service";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => RoleModule),
  ],
  controllers: [UserController],
  providers: [UserService, HashingService],
  exports: [UserService],
})
export class UserModule {}
