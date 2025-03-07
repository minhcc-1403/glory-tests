import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Role } from "~modules/pre-built/2-roles/schemas/role.schema";
import { MenuGroup } from "~modules/pre-built/4-menu-groups/schemas/menu-group.schema";
import { AccountStatus } from "../enums/account-status.enum";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { IUser } from "../interface/user.interface";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "users",
})
export class User implements IUser {
  @Prop([{ type: SchemaTypes.ObjectId, ref: Role.name }])
  roleIds: ObjectId[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: MenuGroup.name,
  })
  menuGroupId?: ObjectId;

  @Prop({ type: String })
  username?: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String, select: false })
  socialID?: string;

  @Prop({ type: String, enum: AccountTypeEnum, default: AccountTypeEnum.Local })
  accountType: AccountTypeEnum;

  @Prop({ type: String, minlength: 6, required: true, select: false })
  password: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: Date })
  dateBirth?: Date;

  @Prop({ type: String, enum: GenderEnum })
  gender?: GenderEnum;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String })
  portfolioWebsite?: string;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: [String] })
  fcmTokens?: string[];

  @Prop({ type: Boolean, default: true })
  fmcEnabled: boolean;

  @Prop({
    type: String,
    enum: AccountStatus,
    default: AccountStatus.Unverified,
  })
  status: AccountStatus;

  // Features
  @Prop({ type: Number, default: 0 })
  reputation: number = 0;

  @Prop({ type: Number, default: 0 })
  questionsCount: number = 0;

  @Prop({ type: Number, default: 0 })
  answersCount: number = 0;

  @Prop([{ type: SchemaTypes.ObjectId, ref: "Question" }])
  upvoteQuestionIds: ObjectId[] = [];

  @Prop([{ type: SchemaTypes.ObjectId, ref: "Question" }])
  downvoteQuestionIds: ObjectId[] = [];

  @Prop([{ type: SchemaTypes.ObjectId, ref: "Question" }])
  savedQuestionIds: ObjectId[] = [];
}

type UserDocument = HydratedDocument<User>;
const UserSchema = SchemaFactory.createForClass(User);

export { UserDocument, UserSchema };
