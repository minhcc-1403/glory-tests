import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { OrganizationService } from "./organization.service";

@Controller("organizations")
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("one")
  @HttpCode(HttpStatus.OK)
  async findOne(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.organizationService.findOne(filter, options);
  }
}
