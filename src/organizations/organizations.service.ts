import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { Organization } from "./entities/organization.entity";

@Injectable()
export class OrganizationsService {
	constructor(
		@InjectRepository(Organization)
		private readonly organizationsRepository: Repository<Organization>,
	) {}
	create(createOrganizationDto: CreateOrganizationDto) {
		const organization = this.organizationsRepository.create(
			createOrganizationDto,
		);

		return this.organizationsRepository.save(organization);
	}

	findAll() {
		return this.organizationsRepository.find();
	}

	async findOne(id: number) {
		const organization = await this.organizationsRepository.findOneBy({ id });

		if (!organization) throw new NotFoundException("Organizationnot found");

		return organization;
	}

	async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
		const organization = await this.organizationsRepository.preload({
			id,
			...updateOrganizationDto,
		});

		if (!organization) throw new NotFoundException("Organizationnot found");

		return this.organizationsRepository.save(organization);
	}

	async remove(id: number) {
		const organization = await this.findOne(id);

		return this.organizationsRepository.remove(organization);
	}
}
