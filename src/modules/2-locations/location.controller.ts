import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { LocationService } from "./location.service";

@Controller("locations")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("one")
  @HttpCode(HttpStatus.OK)
  async findOne(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.locationService.findOne(filter, options);
  }
}
