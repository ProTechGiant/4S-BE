import { ParsedQs } from "qs";
import { BaseService } from "../base/base.service";
import { CommonDTOs } from "../common/dto";
import { RESOURCES_TYPES } from "../common/enums";
import { signToken, tokenDecoder, verifyUserToken } from "../common/utils/assign-and-decode-token";
import { hashPassword, verifyPassword } from "../common/utils/bcrypt";
import { sendMailToVerifyUser } from "../common/utils/send-to-user";
import { WntUsersType } from "../constants/status-codes";
import { BadRequestException, InValidCredentials, NoRecordFoundException, RequestTimeoutException, UnauthorizedException } from "../errors/exceptions";
import { ResetPasswordTokenService } from "../reset-password-token/user-token.service";
import { WntServiceType } from "../sockets/enum/wnt-gateway.enum";
import { WntGetUsersReponse } from "../sockets/interface/reponse.interface";
import { WntAuthenticationInput } from "../sockets/interface/wnt-gateway.interface";
import { WntGatewayService } from "../sockets/wnt-gateway.service";
import { UserProfileService } from "../user-profile/user-profile.service";
import { UserRole } from "../user-role/entity/user-role.entity";
import { UserRoleService } from "../user-role/user-role.service";
import { UserDtos } from "./dto/user.dto";
import { User } from "./entity/user.entity";
import { UserRepository } from "./user.repository";
import { wntUserFormat, deleteWntUserFormat, getWntUserFormat } from "./utils/parser";
import { sendOTP, verifyOTP } from "./utils/twilio";

export class UserService extends BaseService {
  private readonly userRepository: UserRepository;
  private readonly resetPasswordTokenService: ResetPasswordTokenService;
  private readonly userRoleService: UserRoleService;
  private readonly userProfileService: UserProfileService;
  private readonly wntGatewayService: WntGatewayService;

  constructor() {
    super();
    this.userRepository = new UserRepository();
    this.userRoleService = new UserRoleService();
    this.userProfileService = new UserProfileService();
    this.wntGatewayService = new WntGatewayService();
    this.resetPasswordTokenService = new ResetPasswordTokenService();
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.getUserByEmail(email).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    try {
      return this.userRepository.getUserByPhoneNumber(phoneNumber).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return this.userRepository.getUserById(id).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserByIdWithRole(id: string): Promise<User> {
    try {
      return this.userRepository.getUserByIdWithRole(id).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserByIdWithRoleAndRights(id: string): Promise<UserDtos.GetUserByIdWithRoleAndRightsOutput[]> {
    try {
      return this.userRepository.getUserByIdWithRoleAndRights(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  checkWntAccess(userRoles: UserRole[]) {
    let hasAdminAccess = false;
    let hasOperatorAccess = false;
    for (const userRole of userRoles) {
      for (const permission of userRole.role.roleResourcePermission) {
        if (permission.resource.name === RESOURCES_TYPES.SENSOR) {
          hasAdminAccess = permission.canDelete || permission.canUpdate || permission.canWrite;
          hasOperatorAccess = permission.canRead;
        }
      }
    }

    if (hasAdminAccess) return { role: 1 };
    else if (hasOperatorAccess) return { role: 2 };
    else return null;
  }

  async getUserByEmailWithResourcesPermission(email: string): Promise<User> {
    try {
      return this.userRepository.getUserByEmailWithResourcesPermission(email).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findTemporaryDeleteUsersByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findTemporaryDeleteUsersByEmail(email).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async registerUser(input: UserDtos.RegisterDto, _currentUser: CommonDTOs.CurrentUser): Promise<User> {
    try {
      const user = new User();
      const transactionScope = this.getTransactionScope();

      const userExist = await this.getUserByEmail(input.email);
      if (userExist) throw new BadRequestException(`Email already registered`);

      user.firstName = input.firstName;
      user.lastName = input.lastName;
      user.email = input.email;
      if (input.password) user.password = await hashPassword(input.password);
      user.phoneNumber = input.phoneNumber;

      const userRole = await this.userRoleService.assignRolesToUser(input.roleIdz, user, input.siteId);
      user.userRole = userRole;
      transactionScope.add(user);
      await this.userProfileService.createProfileUser(user, input, transactionScope);

      transactionScope.addCollection(user.userRole);
      delete user.userRole;

      await transactionScope.commit();
      await this.emailVerification(user);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginUser(input: UserDtos.LoginDto): Promise<{ token: string }> {
    try {
      const user: User = await this.getUserByEmailWithResourcesPermission(input.email);
      if (!user) throw new InValidCredentials("Invalid credentials specified");

      const isPasswordMatched = await verifyPassword(input.password, user.password);
      if (!isPasswordMatched) throw new InValidCredentials("Invalid credentials specified");

      const payload = {
        email: user.email,
        id: user.id,
        isSuperAdmin: user.isSuperAdmin,
      };

      const token = signToken(payload);
      return { token };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(input: UserDtos.UpdateUserDto, currentUser: CommonDTOs.CurrentUser): Promise<User> {
    try {
      let userRole: UserRole[];
      const transactionScope = this.getTransactionScope();

      const user = await this.findTemporaryDeleteUsersByEmail(currentUser.email);
      if (!user) throw new InValidCredentials("Invalid user specified");
      const emailAlreadyExist = await this.getUserByEmail(input.email);
      if (emailAlreadyExist) throw new InValidCredentials("Email already Registered");
      const phoneAlreadyExist = await this.getUserByPhoneNumber(input.phoneNumber);
      if (phoneAlreadyExist) throw new InValidCredentials("Phone already Registered");

      if (input.siteId && !input.roleIdz) {
        const updatedUserRoles = await this.userRoleService.changeSite(input.siteId, user.id);
        transactionScope.updateCollection(updatedUserRoles);
      }

      if (input.roleIdz && input.siteId) {
        const reAssignedRoles = await this.userRoleService.reAssignRolesToUser(input.roleIdz, user, input.siteId, transactionScope);
        userRole = reAssignedRoles;
      }

      const getUsersWnt = getWntUserFormat();
      const wntUsers = (await this.wntGatewayService.handleSendRequest(getUsersWnt, currentUser as WntAuthenticationInput, WntServiceType.USER)) as WntGetUsersReponse;
      const userExists = wntUsers.data.users.some((wntUser: { username: string }) => wntUser.username === user.email);

      const hasWntRoleResourcePermission = this.checkWntAccess(userRole);

      if (!hasWntRoleResourcePermission && userExists) {
        const deleteUserFormat = deleteWntUserFormat({ email: user.email });
        await this.wntGatewayService.handleSendRequest(deleteUserFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      }

      if (input.email) user.email = input.email;
      if (input.firstName) user.firstName = input.firstName;
      if (input.lastName) user.lastName = input.lastName;
      if (input.phoneNumber) user.phoneNumber = input.phoneNumber;
      if (userRole.length) user.userRole = userRole;

      if (!userExists && (hasWntRoleResourcePermission || !hasWntRoleResourcePermission)) {
        const userFormat = wntUserFormat({ email: user.email, password: user.password, name: user.firstName + " " + user.lastName, role: hasWntRoleResourcePermission.role }, WntUsersType.CREATE);
        await this.wntGatewayService.handleSendRequest(userFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      }

      if (userExists && hasWntRoleResourcePermission) {
        const userFormat = wntUserFormat({ email: user.email, password: user.password, name: user.firstName + " " + user.lastName, role: hasWntRoleResourcePermission.role }, WntUsersType.UPDATE);
        await this.wntGatewayService.handleSendRequest(userFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      }

      transactionScope.update(user);
      await transactionScope.commit();
      delete user.userRole;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  async insertUserInfo(input: UserDtos.InserUserDto): Promise<User> {
    try {
      const transactionScope = this.getTransactionScope();

      const user = await this.findTemporaryDeleteUsersByEmail(input.email);
      if (!user) throw new InValidCredentials("Invalid user specified");

      const phoneAlreadyExist = await this.getUserByPhoneNumber(input.phoneNumber);
      if (phoneAlreadyExist) throw new InValidCredentials("Phone already Registered");

      if (input.siteId && !input.roleIdz) {
        const updatedUserRoles = await this.userRoleService.changeSite(input.siteId, user.id);
        transactionScope.updateCollection(updatedUserRoles);
      }

      // const wntUsers = (await this.wntGatewayService.handleSendRequest(getUsersWnt, currentUser as WntAuthenticationInput, WntServiceType.USER)) as WntGetUsersReponse;
      // const userExists = wntUsers.data.users.some((wntUser: { username: string }) => wntUser.username === user.email);

      // const hasWntRoleResourcePermission = this.checkWntAccess(userRole);

      // if (!hasWntRoleResourcePermission && userExists) {
      //   const deleteUserFormat = deleteWntUserFormat({ email: user.email });
      //   await this.wntGatewayService.handleSendRequest(deleteUserFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      // }

      if (input.email) user.email = input.email;
      if (input.firstName) user.firstName = input.firstName;
      if (input.lastName) user.lastName = input.lastName;
      if (input.phoneNumber) user.phoneNumber = input.phoneNumber;
      if (input.password) user.password = await hashPassword(input.password);

      // if (!userExists && (hasWntRoleResourcePermission || !hasWntRoleResourcePermission)) {
      //   const userFormat = wntUserFormat({ email: user.email, password: user.password, name: user.firstName + " " + user.lastName, role: hasWntRoleResourcePermission.role }, WntUsersType.CREATE);
      //   await this.wntGatewayService.handleSendRequest(userFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      // }

      // if (userExists && hasWntRoleResourcePermission) {
      //   const userFormat = wntUserFormat({ email: user.email, password: user.password, name: user.firstName + " " + user.lastName, role: hasWntRoleResourcePermission.role }, WntUsersType.UPDATE);
      //   await this.wntGatewayService.handleSendRequest(userFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      // }

      transactionScope.update(user);
      await transactionScope.commit();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteUser(userId: string, currentUser: CommonDTOs.CurrentUser): Promise<User> {
    try {
      const transactionScope = this.getTransactionScope();

      const user = await this.userRepository.getUserByIdAndUserRole(userId).getOne();
      if (!user) throw new NoRecordFoundException("Invalid user specified");

      user.transactionScope = transactionScope;
      const deleteUserFormat = deleteWntUserFormat({ email: user.email });
      await this.wntGatewayService.handleSendRequest(deleteUserFormat, currentUser as WntAuthenticationInput, WntServiceType.USER);
      transactionScope.delete(user);
      transactionScope.hardDeleteCollection(user.userRole);
      await transactionScope.commit();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async forgotPassword(input: UserDtos.ForgotPasswordDto): Promise<CommonDTOs.MessageResponse> {
    try {
      const user = input.email ? await this.getUserByEmail(input.email) : await this.getUserByPhoneNumber(input.phoneNumber);
      if (!user) throw new InValidCredentials("Invalid credentials specified");

      const result = input.email ? await this.resetPasswordTokenService.createTokenAndSendToClient(user) : sendOTP(input.phoneNumber);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async resetPassword(input: UserDtos.ResetPasswordDto): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = this.getTransactionScope();

      const user = await this.getUserById(input.userId);
      if (!user) throw new InValidCredentials("Invalid User specified");
      const passwordToken = await this.resetPasswordTokenService.getTokenByUserId(input.userId);
      if (!passwordToken) throw new RequestTimeoutException("Request has timed out");
      if (passwordToken.passwordToken !== input.token) throw new InValidCredentials("Invalid token specified");

      user.password = await hashPassword(input.password);
      transactionScope.update(user);
      transactionScope.commit();
      this.resetPasswordTokenService.deletePasswordToken(user.id);

      return { message: "Your password has been updated" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async changePassword(input: UserDtos.ChangePasswordDto, email: string): Promise<User> {
    try {
      const transactionScope = this.getTransactionScope();

      const user = await this.findTemporaryDeleteUsersByEmail(email);
      if (!user) throw new InValidCredentials("Invalid credentials specified");

      const isPasswordMatched = await verifyPassword(input.currentPassword, user.password);
      if (!isPasswordMatched) throw new InValidCredentials("Invalid credentials specified");

      user.password = await hashPassword(input.newPassword);

      transactionScope.update(user);
      await transactionScope.commit();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  async emailVerify(input: ParsedQs): Promise<User> {
    try {
      const transactionScope = this.getTransactionScope();

      const decodedUser = tokenDecoder(input.token.toString());
      if (!decodedUser) throw new UnauthorizedException("Invalid authorization specified");

      const user = await this.getUserById(decodedUser.id);
      if (!user) throw new InValidCredentials("Invalid credentials specified");

      if (!user.isActive) user.isActive = true;
      transactionScope.update(user);
      await transactionScope.commit();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async emailVerification(user: User): Promise<CommonDTOs.MessageResponse> {
    try {
      const token = verifyUserToken(user.id);
      await sendMailToVerifyUser(user, process.env.BACK_END_URL + "user/verify?token=" + token);

      return { message: "Check your Email to verify it" };
    } catch (error) {
      throw new Error(error);
    }
  }
  async PhoneNumberVerify(input: UserDtos.PhoneNumberVerifyDto): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = this.getTransactionScope();

      const token = verifyOTP(input.phoneNumber, input.code);
      const user = await this.getUserByPhoneNumber(input.phoneNumber);
      if ((await token).message === "approved") user.phoneNumberVerification = true;

      transactionScope.update(user);
      await transactionScope.commit();

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
}
