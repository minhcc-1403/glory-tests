import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "assets",
})
export class Asset {
  @Prop({ type: String, required: true })
  serial: string;

  @Prop({ type: String, required: true })
  locationCustomId: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  createdAt: Date;
}

export type AssetDocument = Asset & HydratedDocument<Asset>;
export const AssetSchema = SchemaFactory.createForClass(Asset);
