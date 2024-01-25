import { BaseService } from "../base/base.service";
import { CommonDTOs } from "../common/dto";
import { NarrowbandLocationData } from "./entity/narrowband-location-data.entity";
import { NarrowbandLocationDataRepository } from "./narrowband-location-data.repository";

export class NarrowbandLocationDataService extends BaseService {
  private readonly narrowbandLocationDataRepository: NarrowbandLocationDataRepository;
  constructor() {
    super();
    this.narrowbandLocationDataRepository =
      new NarrowbandLocationDataRepository();
  }

  async getLastNarrowbandLocationData(): Promise<NarrowbandLocationData> {
    try {
      return this.narrowbandLocationDataRepository
        .getLastNarrowbandLocationData()
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
}
