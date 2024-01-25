import { Request, Response } from "express";
import { UserService } from "./user.service";
export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  registerUser = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.userService.registerUser(input, currentUser);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.userService.loginUser(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  updateUser = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.userService.updateUser(input, currentUser);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  insertUserInfo = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.userService.insertUserInfo(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  deleteUser = async (req: RequestTypes, res: Response): Promise<void> => {
    const { userId } = req.params;
    const currentUser = req.currentUser;
    try {
      const result = await this.userService.deleteUser(userId, currentUser);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.userService.forgotPassword(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.userService.resetPassword(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  emailVerify = async (req: Request, res: Response): Promise<void> => {
    const input = req.query;
    try {
      const result = await this.userService.emailVerify(input);
      res
        .writeHead(301, {
          Location: `${process.env.CUSTOMER_APP_URL}auth/sign-up/${result.id}`,
        })
        .end();
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  PhoneNumberVerify = async (req: Request, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.userService.PhoneNumberVerify(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  changePassword = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.userService.changePassword(input, currentUser.email);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
