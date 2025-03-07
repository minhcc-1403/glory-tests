import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { AssetService } from "./asset.service";

@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("one")
  @HttpCode(HttpStatus.OK)
  async findOne(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.assetService.findOne(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.assetService.findById(id, { projection, populate });
  }
}
