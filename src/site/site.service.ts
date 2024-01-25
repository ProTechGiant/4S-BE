import { BaseService } from "../base/base.service";
import { Site } from "./entity/site.entity";
import { SiteRepository } from "./site.repository";
import { CommonDTOs } from "../common/dto";
import { NoRecordFoundException } from "../errors/exceptions";
import { SiteDtos } from "./dto/site.dto";
import { JsonToObject } from "../common/utils/json-to-object";

export class SiteService extends BaseService {
  private readonly siteRepository: SiteRepository;

  constructor() {
    super();
    this.siteRepository = new SiteRepository();
  }

  async getSiteById(sideId: string): Promise<Site> {
    return this.siteRepository.getSiteById(sideId).getOne();
  }

  async getFirstSite(): Promise<Site> {
    return this.siteRepository.getAllSites().getOne();
  }

  async getAllSites(input: SiteDtos.GetAllSiteInput): Promise<Site[]> {
    const filterInput = JsonToObject(input.filterInputString);

    return this.siteRepository.getAllSites(input, filterInput).getMany();
  }

  async createSite(input: SiteDtos.CreateSiteInput): Promise<Site> {
    const site = new Site();
    const transactionScope = this.getTransactionScope();

    site.name = input.name;

    transactionScope.add(site);
    await transactionScope.commit();
    return site;
  }
  async updateSite(input: SiteDtos.UpdateSiteInput, siteId: string): Promise<Site> {
    const transactionScope = this.getTransactionScope();
    const site = await this.getSiteById(siteId);
    if (!site) throw new NoRecordFoundException("Invalid Site Specified");

    if (input.name) site.name = input.name;

    site.transactionScope = transactionScope;
    transactionScope.update(site);
    await transactionScope.commit();
    return site;
  }

  async deleteSite(siteId: string, currentUser: CommonDTOs.CurrentUser): Promise<CommonDTOs.MessageResponse> {
    const site = await this.getSiteById(siteId);
    const transactionScope = this.getTransactionScope();
    if (!site) throw new NoRecordFoundException("Invalid Site Specified");
    site.currentUser = currentUser;
    site.transactionScope = transactionScope;
    transactionScope.delete(site);
    await transactionScope.commit();
    return { message: "Site deleted" };
  }
}
