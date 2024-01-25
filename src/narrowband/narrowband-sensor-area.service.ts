import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { NarrowbandSensorArea } from "./entity/narrowband-sensor-area.entity";
import { NarrowbandSensorAreaRepository } from "./narrowband-sensor-area.repository";

export class NarrowbandSensorAreaService extends BaseService {
  private readonly narrowbandSensorAreaRepository: NarrowbandSensorAreaRepository;
  constructor() {
    super();
    this.narrowbandSensorAreaRepository = new NarrowbandSensorAreaRepository();
  }

  async getNarrowbandSensorArea(params: CommonDTOs.FilterParam): Promise<NarrowbandSensorArea[]> {
    try {
      return this.narrowbandSensorAreaRepository.getNarrowbandSensorArea(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteNarrowbandSensorArea(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<NarrowbandSensorArea[]> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const narrowbandSensorAreas = await this.getNarrowbandSensorArea(params);
      transactionScope.deleteCollection(narrowbandSensorAreas);
      return narrowbandSensorAreas;
    } catch (error) {
      throw new Error(error);
    }
  }
}
