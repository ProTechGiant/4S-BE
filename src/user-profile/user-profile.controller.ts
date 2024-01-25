import { Response } from "express";
import { UserProfileService } from "./user-profile.service";

export class UserController {
  private readonly userProfileService: UserProfileService;

  constructor() {
    this.userProfileService = new UserProfileService();
  }

  updateProfileUser = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.userProfileService.updateProfileUser(input, currentUser);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getUserProfile = async (req: RequestTypes, res: Response): Promise<void> => {
    const currentUser = req.currentUser;
    try {
      const result = await this.userProfileService.getUserProfile({ user: currentUser.id });
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
