import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssetsController } from "./assets.controller";
import { Asset } from "./entities/asset.entity";
import { AssetService } from "src/assets/assets.service";

@Module({
	imports: [TypeOrmModule.forFeature([Asset])],
	controllers: [AssetsController],
	providers: [AssetService],
	exports: [AssetService],
})
export class AssetsModule {}
