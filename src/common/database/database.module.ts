import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";

import mongoose from "mongoose";
import { EnvStatic } from "src/configurations/static.env";
import { mongoosePaginateV2 } from "./mongoose-paginate.config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async () => ({
        uri: EnvStatic.getDatabaseConfig().uri,
        retryWrites: true,
        autoIndex: true,

        connectionFactory: (connection: any) => {
          // Plugin
          connection.plugin(mongoosePaginateV2);

          // Check connect success
          if (connection.readyState === 1) {
            Logger.log(`MongDB Connected: ${connection.host}`, "MongoDBConnection");
          }

          return connection;
        },

        w: "majority",
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: "DATABASE_CONNECTION",
      useFactory: (connection: mongoose.Connection) => connection,
      inject: [getConnectionToken()], // Lấy connection từ Mongoose
    },
  ],
  exports: ["DATABASE_CONNECTION"],
})
export class DatabaseModule {}
