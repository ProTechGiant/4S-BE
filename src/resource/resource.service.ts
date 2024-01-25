import { BaseService } from "../base/base.service";
import { ResourceRepository } from "./resource.repository";
import { Resource } from "./entity/resource.entity";
import { RESOURCES_TYPES, RoleTypes } from "../common/enums";
import { CommonDTOs } from "../common/dto";
import { getFriendlyName } from "../common/utils/get-friendly-name";
import { DataModelsService } from "../data-models/data-models.service";

export class ResourceService extends BaseService {
  private readonly resourceRepository: ResourceRepository;
  private readonly dataModelsService: DataModelsService;
  
  constructor() {
    super();
    this.resourceRepository = new ResourceRepository();
    this.dataModelsService = new DataModelsService();
  }

  async getResourceByName(name: string): Promise<Resource> {
    try {
      return this.resourceRepository.getResourceByName(name).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllResourcesNames(): Promise<RESOURCES_TYPES[]> {
    try {
      const resources = await this.resourceRepository.getAllResources().getMany();
      const names = resources.map((item) => item.name) as RESOURCES_TYPES[]
      return names
    } catch (error) {
      throw new Error(error);
    }
  }

  async getResourcesByIdz(idz: string[]): Promise<Resource[]> {
    try {
      return this.resourceRepository.getResourcesByIdz(idz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getResourceByNamesAndType(names: string[]): Promise<Resource[]> {
    try {
      return this.resourceRepository.getResourceByNamesAndType(names).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserResource(currentUser: CommonDTOs.CurrentUser): Promise<string[]> {
    try {
      let resources: Resource[] = []
      if (currentUser.isSuperAdmin) {
        resources = await this.resourceRepository.getAllResources().getMany();
      } else {
        resources = await this.resourceRepository.getUserResources(currentUser.id).getMany();
      }
        
      const names = resources.map((item) => item.name);
      return names;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserResourceWithColumnNames(currentUser: CommonDTOs.CurrentUser): Promise<any> {
    try {
      const resourcesNames = await this.getUserResource(currentUser);

      let resources = await this.dataModelsService.getColumnsByEntityNames(resourcesNames);

      return resources;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getResourcesByRoleIdz(roleIdz: string[]): Promise<RESOURCES_TYPES[]> {
    try {
      const resources = await this.resourceRepository.getResourcesByRoleIdz(roleIdz).getMany();
      const names = resources.map((item) => item.name) as RESOURCES_TYPES[]
      return names;
    } catch (error) {
      throw new Error(error);
    }
  }
}
