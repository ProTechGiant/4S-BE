import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { InValidCredentials } from "../errors/exceptions";
import { ResourceService } from "../resource/resource.service";
import { UserDtos } from "../user/dto/user.dto";
import { User } from "../user/entity/user.entity";
import { UserProfile } from "./entity/user-profile.entity";
import { UserProfileRepository } from "./user-profile.repository";
import { getFriendlyName } from "../common/utils/get-friendly-name";
import { ChartTypes, RESOURCES_TYPES } from "../common/enums";
import { UserProfileDtos } from "./dto/user-profile.dto";

export class UserProfileService extends BaseService {
  private readonly userProfileRepository: UserProfileRepository;
  private readonly resourceService: ResourceService;

  constructor() {
    super();
    this.userProfileRepository = new UserProfileRepository();
    this.resourceService = new ResourceService();
  }

  async createProfileUser(user: User, input?: UserDtos.RegisterDto, tScope?: TransactionScope, isAdmin?: boolean): Promise<UserProfile> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const userProfile = new UserProfile();
      let userResource: RESOURCES_TYPES[] = [];

      if (isAdmin) {
        userResource = await this.resourceService.getAllResourcesNames();
      } else {
        userResource = await this.resourceService.getResourcesByRoleIdz(input.roleIdz);
      }

      const chart = userResource.slice(0, 2).map((value, index) => {
        return {
          chart: index == 0 ? ChartTypes.PIE_CHART : index === 1 ? ChartTypes.HISTO_GRAM : null,
          entity: value as RESOURCES_TYPES,
        };
      });

      const card = userResource.slice(0, 4).map((item) => item) as RESOURCES_TYPES[];

      const table = {
        entity: userResource[0] as RESOURCES_TYPES,
        filterInputString: "{}",
        joinTables: [],
        columns: ["*"],
      };

      const dashboard = {
        chart: chart,
        card: card,
        table: table,
        sequence: ["card", "chart", "table"],
      };

      userProfile.dashboard = dashboard;
      userProfile.user = user;
      userProfile.notificationPreferences = JSON.parse(JSON.stringify({ pushNotification: false, pushSms: false, pushEmail: false }));
      if (input?.image) userProfile.image = Buffer.from(input.image);

      transactionScope.add(userProfile);
      if (!tScope) transactionScope.commit();
      return userProfile;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProfileUser(input: UserProfileDtos.UpdateUserProfileDto, currentUser: CommonDTOs.CurrentUser, tScope?: TransactionScope): Promise<UserProfile> {
    try {
      const transactionScope = this.getTransactionScope();

      const userProfile = await this.getUserProfile({ user: currentUser.id });
      if (!userProfile) throw new InValidCredentials("Invalid user profile specified");

      if (input.image) userProfile.image = Buffer.from(input.image);
      if (input.notificationPreferences) userProfile.notificationPreferences = input.notificationPreferences;
      if (input.dashboard) userProfile.dashboard = input.dashboard;

      transactionScope.add(userProfile);
      if (!tScope) transactionScope.commit();
      return userProfile;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserProfile(params: CommonDTOs.FilterParam): Promise<UserProfile> {
    try {
      return this.userProfileRepository.getUserProfile(params).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
}
