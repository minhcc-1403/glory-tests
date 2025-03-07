import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Organization } from "~modules/1-organizations/schemas/organization.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "locations",
})
export class Location {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Organization.name, required: true })
  organizationId: ObjectId;

  @Prop({ type: String, enum: ["active", "inactive"], default: "active" })
  status: "active" | "inactive";

  @Prop({ type: String, default: () => `${Date.now()}` })
  customId: string;
}

export type LocationDocument = Location & HydratedDocument<Location>;
export const LocationSchema = SchemaFactory.createForClass(Location);
