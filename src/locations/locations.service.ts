import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationsService {
	constructor(
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
	) {}
	create(createLocationDto: CreateLocationDto) {
		const location = this.locationsRepository.create(createLocationDto);

		return this.locationsRepository.save(location);
	}

	findAll(options?: FindManyOptions<Location>) {
		return this.locationsRepository.find(options);
	}

	async findOne(id: number) {
		const location = await this.locationsRepository.findOneBy({ id });

		if (!location) throw new NotFoundException("Location not found");

		return location;
	}

	async update(id: number, updateLocationDto: UpdateLocationDto) {
		const location = await this.locationsRepository.preload({
			id,
			...updateLocationDto,
		});

		if (!location) throw new NotFoundException("Location not found");

		return this.locationsRepository.save(location);
	}

	async remove(id: number) {
		const location = await this.findOne(id);

		return this.locationsRepository.remove(location);
	}
}
