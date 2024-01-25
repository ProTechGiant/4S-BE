import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { NoRecordFoundException, NotFoundException } from "../errors/exceptions";
import { Site } from "../site/entity/site.entity";
import { SiteService } from "../site/site.service";
import { User } from "../user/entity/user.entity";
import { UserService } from "../user/user.service";
import { PersonnelDtos } from "./dto/personnel.dto";
import { Personnel } from "./entity/personnel.entity";
import { PersonnelRepository } from "./personnel.repository";
export class PersonnelService extends BaseService {
  private readonly siteService: SiteService;
  private readonly userService: UserService;
  private readonly personnelRepository: PersonnelRepository;

  constructor() {
    super();
    this.siteService = new SiteService();
    this.userService = new UserService();
    this.personnelRepository = new PersonnelRepository();
  }

  async createPersonnel(input: PersonnelDtos.CreatePersonnelDto): Promise<Personnel> {
    try {
      let user: User;
      const personnel = new Personnel();
      const transactionScope = this.getTransactionScope();

      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      if (input.userId) {
        user = await this.userService.getUserById(input.userId);
        if (!user) throw new NotFoundException("Invalid user specification");
      }

      personnel.firstName = input.firstName;
      personnel.lastName = input.lastName;
      personnel.emergencyContact = input.emergencyContact;
      personnel.site = site;
      personnel.userId = input.userId;

      transactionScope.add(personnel);
      transactionScope.commit();
      return personnel;
    } catch (error) {
      throw new Error(error);
    }
  }

  async unlinkPersonnel(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<Personnel[]> {
    const transactionScope = tScope ?? this.getTransactionScope();

    const personnels = await this.getPersonnels(params);

    for (const personnel of personnels) {
      if (params.site) personnel.site = null;
      else if (params.userId) personnel.userId = null;
    }

    transactionScope.updateCollection(personnels);
    return personnels;
  }

  async updatePersonnel(input: PersonnelDtos.UpdatePersonnelDto, params: CommonDTOs.FilterParam): Promise<Personnel> {
    const transactionScope = this.getTransactionScope();
    let site: Site;
    let user: User;

    const [personnel] = await this.getPersonnels(params);
    if (!personnel) throw new NotFoundException("Invalid personnel specified");

    if (input.siteId) {
      site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NotFoundException("Invalid site specification");
    }

    if (input.userId) {
      user = await this.userService.getUserById(input.userId);
      if (!user) throw new NotFoundException("Invalid user specification");
    }

    if (input.firstName) personnel.firstName = input.firstName;
    if (input.lastName) personnel.lastName = input.lastName;
    if (input.emergencyContact) personnel.emergencyContact = input.emergencyContact;
    if (input.siteId) personnel.site = site;
    if (input.userId) personnel.userId = input.userId;

    transactionScope.update(personnel);
    await transactionScope.commit();
    return personnel;
  }

  async getPersonnels(params: CommonDTOs.FilterParam): Promise<Personnel[]> {
    try {
      return this.personnelRepository.getPersonnels(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }
}
