import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Organization, OrganizationDocument } from "./schemas/organization.schema";

@Injectable()
export class OrganizationService extends BaseService<OrganizationDocument> {
  constructor(@InjectModel(Organization.name) model: Model<OrganizationDocument>) {
    super(model);
  }
}
