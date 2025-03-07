import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "~common/database/database.module";
import { AssetController } from "./asset.controller";
import { AssetService } from "./asset.service";
import { Asset, AssetSchema } from "./schemas/asset.schema";

// MODULE: handle all asset related operations
@Module({
  imports: [MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]), DatabaseModule],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
