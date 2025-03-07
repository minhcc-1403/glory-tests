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
import { PaginationDto } from "~dto/pagination.dto";
import { formatMenus } from "~helpers/format-menu";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { MenuService } from "./menu.service";

@Controller("menus")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  //  ----- Method: GET -----
  @Get("/:id")
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.menuService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    const systemMenus = await this.menuService.findMany(filter, options);

    return formatMenus(systemMenus);
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateMenuDto) {
    return this.menuService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateMenuDto) {
    return this.menuService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.menuService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
