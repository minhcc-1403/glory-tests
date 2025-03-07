import {
	Controller,
} from "@nestjs/common";
import { AssetService } from "src/assets/assets.service";

@Controller("assets")
export class AssetsController {
	constructor(private readonly assetsService: AssetService) {}

}
