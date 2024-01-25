import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne, BeforeSoftRemove } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { ResetPasswordToken } from "../../reset-password-token/entity/user-token.entity";
import { UserRole } from "../../user-role/entity/user-role.entity";
import { PersonnelService } from "../../personnel/personnel.service";
import { UserProfile } from "../../user-profile/entity/user-profile.entity";

@Entity({ name: "user" })
export class User extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "first_name", type: "varchar", nullable: true })
  firstName: string;

  @Column({ name: "last_name", type: "varchar", nullable: true })
  lastName: string;

  @Column({ name: "email", type: "varchar", unique: true })
  email: string;

  @Column({ name: "phone_number", type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({ name: "password", type: "varchar", nullable: true })
  password: string;

  @Column({ name: "is_active", type: "boolean", default: false })
  isActive: boolean;

  @Column({ name: "phone_number_verification", type: "boolean", default: false })
  phoneNumberVerification: boolean;

  @Column({ name: "is_super_admin", type: "boolean", default: false })
  isSuperAdmin: boolean;

  @OneToOne(() => ResetPasswordToken, (resetPasswordToken) => resetPasswordToken.user)
  resetPasswordToken: ResetPasswordToken;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  userProfile: UserProfile[];

  @OneToMany(() => UserRole, (userRole) => userRole.user, { nullable: false })
  userRole: UserRole[];

  @BeforeSoftRemove()
  async beforeRemove() {
    const personnelService = new PersonnelService();
    await personnelService.unlinkPersonnel({ userId: this.id }, this.transactionScope);
  }
}
