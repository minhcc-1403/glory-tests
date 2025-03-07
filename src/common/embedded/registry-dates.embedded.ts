import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class RegistryDates {
	@CreateDateColumn({ type: "timestamp" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updatedAt: Date;
}
