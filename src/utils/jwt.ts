import { sign, verify } from 'jsonwebtoken';

export type userTokenPayload = {
  socialId: string;
}

export const createJWT = (socialId: string): string => {
  
  return sign({socialId}, process.env.JWT_PRIVATE_KEY, {expiresIn: 24 * 60 * 60 * 365});
  // return jwt.sign(socialId, process.env.JWT_PRIVATE_KEY, {expiresIn: 24 * 60 * 60 * 365});
};

export const decodeJWT = (token: string): userTokenPayload => {
  return verify(token, process.env.JWT_PRIVATE_KEY) as userTokenPayload;
};
