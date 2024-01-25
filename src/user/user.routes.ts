import express from "express";

import { validationMiddleware } from "../errors/middleware/validation.middleware";

import { UserDtos } from "./dto/user.dto";
import { UserController } from "./user.controller";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";

const router = express.Router();

// create instance
const userController = new UserController();

// Routes
router.post(
  "/register",
  authentication(RESOURCES_TYPES.USER, PERMISSIONS_TYPES.WRITE),
  /* #swagger.securityDefinitions = {
     "Bearer": {
         "type": "apiKey",
         "name": "Authorization",
         "in": "header"
     }
} */

  /* #swagger.tags = ['User']
   #swagger.description = 'Register User'
   #swagger.parameters['Params'] = {
       in: 'body',
       required: true,
       schema: {
           "firstName": "",
           "lastName": "",
           "password": "",
           "email": "",
           "phoneNumber": "",
           "siteId": "",
           "type": "",
           "roleIdz": [],
           "pushNotificationToken": ""
       }
   }
   #swagger.security = [{
       "Bearer": []
   }]
*/

  validationMiddleware(UserDtos.RegisterDto),
  userController.registerUser
);

router.post(
  "/login",
  validationMiddleware(UserDtos.LoginDto),
  /* #swagger.tags = ['Authentication']
   #swagger.description = 'User Login'
   #swagger.parameters['LoginParams'] = {
       in: 'body',
       required: true,
       schema: {
           "email": "",
           "password": ""
       }
   }
*/
  userController.loginUser
);

router.put(
  "/",
  /* #swagger.tags = ['User']
   #swagger.description = 'Update User Profile'
   #swagger.parameters['UpdateUserProfileData'] = {
       in: 'body',
       required: true,
       schema: {
           "firstName" : "",
  "lastName": "",
  "password": "",
  "phoneNumber": "",
  "siteId": "",
  "type": "admin",
  "roleIdz": [""],
  "pushNotificationToken": ""
       }
   }
*/

  validationMiddleware(UserDtos.UpdateUserDto),
  authentication(RESOURCES_TYPES.USER, PERMISSIONS_TYPES.UPDATE),
  userController.updateUser
);
router.put(
  "/insert-user",
  /* #swagger.tags = ['User']
   #swagger.description = 'Update User Profile'
   #swagger.parameters['UpdateUserProfileData'] = {
       in: 'body',
       required: true,
       schema: {
           "firstName" : "",
  "lastName": "",
  "password": "",
  "phoneNumber": "",
  "siteId": "",
  "type": "admin",
  "roleIdz": [""],
  "pushNotificationToken": ""
       }
   }
*/

  validationMiddleware(UserDtos.UpdateUserDto),
  userController.insertUserInfo
);
router.delete(
  "/:userId",

  /* #swagger.tags = ['User']
   #swagger.description = 'Soft Delete User'
   #swagger.parameters['SoftDeleteUserParams'] = {
       in: 'path',
       required: true,
       name: 'userId',
       type: 'string',
       description: 'ID of the user to soft delete.'
   }
*/

  authentication(RESOURCES_TYPES.USER, PERMISSIONS_TYPES.DELETE),
  userController.deleteUser
);
router.put(
  "/change-password",

  /* #swagger.tags = ['User']
   #swagger.description = 'Update Password'
   #swagger.parameters['ChangePasswordParams'] = {
       in: 'body',
       required: true,
       schema: {
           "currentPassword": "",
           "newPassword":"" ,      
       }
   } 
      #swagger.security = [{
       "Bearer": []
   }]
*/
  authentication(RESOURCES_TYPES.USER, PERMISSIONS_TYPES.UPDATE),
  validationMiddleware(UserDtos.ChangePasswordDto),
  userController.changePassword
);

router.post(
  "/forgot-password",
  /* #swagger.tags = ['User']
   #swagger.description = 'Request Password Reset'
   #swagger.parameters['ResetParams'] = {
       in: 'body',
       required: true,
       schema: {
           "email": ""
       }
   }
*/
  validationMiddleware(UserDtos.ForgotPasswordDto),
  userController.forgotPassword
);

router.post(
  "/reset-password",
  /* #swagger.tags = ['User']
   #swagger.description = 'Reset User Password'
   #swagger.parameters['ResetPasswordParams'] = {
       in: 'body',
       required: true,
       schema: {
           "password": "",
           "token": "",
           "userId": ""
       }
   } 
*/
  validationMiddleware(UserDtos.ResetPasswordDto),
  userController.resetPassword
);
router.get(
  "/verify",
  /* #swagger.tags = ['User']
   #swagger.description = 'Reset User Password'
   #swagger.parameters['ResetPasswordParams'] = {
       in: 'body',
       required: true,
       schema: {
           "password": "",
           "token": "",
           "userId": ""
       }
   } 
*/
  // validationMiddleware(UserDtos.ResetPasswordDto),
  userController.emailVerify
);
router.get(
  "/verify",
  /* #swagger.tags = ['User']
   #swagger.description = 'Reset User Password'
   #swagger.parameters['ResetPasswordParams'] = {
       in: 'body',
       required: true,
       schema: {
           "password": "",
           "token": "",
           "userId": ""
       }
   } 
*/
  // validationMiddleware(UserDtos.ResetPasswordDto),
  userController.emailVerify
);
router.get(
  "/phone-number/verify",

  validationMiddleware(UserDtos.PhoneNumberVerifyDto),
  userController.PhoneNumberVerify
);
export default router;
