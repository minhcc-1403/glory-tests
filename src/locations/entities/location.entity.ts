import { Asset } from "src/assets/entities/asset.entity";
import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { Organization } from "src/organizations/entities/organization.entity";
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "locations" })
export class Location {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	status: string; // 'active' | 'inactive'

	@ManyToOne(() => Organization, (org) => org.locations, {
		onDelete: "CASCADE",
	})
	organization: Organization;

	@OneToMany(() => Asset, (asset) => asset.locationCustomId)
	assets: Asset[];

	@Column(() => RegistryDates, { prefix: false })
	registerDates: RegistryDates;
}
