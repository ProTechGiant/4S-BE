const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const verifySid = process.env.TWILIO_VERIFY_SID;

export const sendOTP = async (phoneNumber: string) => {
  try {
    const verification = await client.verify.v2.services(verifySid).verifications.create({ to: phoneNumber, channel: "sms" });
    return { message: `${verification.sid}` };
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyOTP = async (phoneNumber: string, userEnteredOTP: string) => {
  try {
    const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({ to: phoneNumber, code: userEnteredOTP });

    return { message: verificationCheck.status };
  } catch (error) {
    if (error.code === 60200) {
      throw new Error("Invalid or expired verification code");
    } else {
      throw new Error("Failed to verify OTP");
    }
  }
};
