import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "organizations",
})
export class Organization {
  @Prop({ type: String, required: true })
  name: string;
}

export type OrganizationDocument = Organization & HydratedDocument<Organization>;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
