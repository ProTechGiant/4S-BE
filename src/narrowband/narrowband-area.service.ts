import { Area } from "../area/entity/area.entity";
import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { NoRecordFoundException } from "../errors/exceptions";
import { NarrowbandArea } from "./entity/narrowband-area.entity";
import { NarrowbandAreaRepository } from "./narrowband-area.repository";

export class NarrowbandAreaService extends BaseService {
  private readonly narrowbandAreaRepository: NarrowbandAreaRepository;

  constructor() {
    super();
    this.narrowbandAreaRepository = new NarrowbandAreaRepository();
  }

  async createNarrowbandArea(area: Area, transactionScope: TransactionScope): Promise<NarrowbandArea> {
    try {
      const narrowbandArea = new NarrowbandArea();
      narrowbandArea.area = area;
      transactionScope.add(narrowbandArea);
      return narrowbandArea;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteNarrowbandArea(params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      const narrowbandAreas = await this.getNarrowbandArea(params);
      if (!tScope && !narrowbandAreas.length) throw new NoRecordFoundException("Invalid narrowband area specified");


      transactionScope.deleteCollection(narrowbandAreas);
      if (!tScope) await transactionScope.commit();

      return { message: "Area deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNarrowbandArea(params: CommonDTOs.FilterParam): Promise<NarrowbandArea[]> {
    try {
      return this.narrowbandAreaRepository.getNarrowbandArea(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNarrowbandAreaByIdz(idz: string[]): Promise<NarrowbandArea[]> {
    try {
      return this.narrowbandAreaRepository.getNarrowbandAreaByIdz(idz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }
}
