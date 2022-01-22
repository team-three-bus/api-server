import { sign } from 'jsonwebtoken';

export const createJWT = (socialId: string): string => {
  
  return sign({socialId}, process.env.JWT_PRIVATE_KEY, {expiresIn: 24 * 60 * 60 * 365});
  // return jwt.sign(socialId, process.env.JWT_PRIVATE_KEY, {expiresIn: 24 * 60 * 60 * 365});
};