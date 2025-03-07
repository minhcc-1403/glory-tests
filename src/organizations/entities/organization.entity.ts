import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { Location } from "src/locations/entities/location.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "organizations" })
export class Organization {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Location, (location) => location.organization)
	locations: Location[];

	@Column(() => RegistryDates, { prefix: false })
	registerDates: RegistryDates;
}
