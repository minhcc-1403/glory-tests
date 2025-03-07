import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	name: string;

	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	phone: string;

	@Column({ nullable: false })
	password: string;

	@Column(() => RegistryDates, { prefix: false })
	registerDates: RegistryDates;
}
