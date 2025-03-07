import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Location, LocationDocument } from "./schemas/location.schema";

@Injectable()
export class LocationService extends BaseService<LocationDocument> {
  constructor(@InjectModel(Location.name) model: Model<LocationDocument>) {
    super(model);
  }
}
