import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";

import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { Public } from "~common/decorators/public.decorator";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { PolicyService } from "~modules/pre-built/3-policies/policy.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { ResourceService } from "./resource.service";

@Controller("resources")
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly policyService: PolicyService,
  ) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    const res = await this.resourceService.paginate(filter, options);

    await this.policyService.assignPoliciesToResources(res.data);

    return res;
  }

  @Get("/:id")
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.resourceService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    const res = await this.resourceService.findMany(filter, options);

    await this.policyService.assignPoliciesToResources(res);

    return res;
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUserId() userId: ObjectId, @Body() body: CreateResourceDto) {
    Object.assign(body, { createdBy: userId });

    return this.resourceService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateResourceDto) {
    return this.resourceService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.resourceService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
