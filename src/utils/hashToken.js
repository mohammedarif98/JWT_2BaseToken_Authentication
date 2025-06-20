
import bcrypt from 'bcryptjs';



// Hash refresh token before storing in DB
export const hashRefreshToken = async (token) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(token, salt);
};


// Compare refresh token with stored hash
export const compareRefreshToken = async (token, hashedToken) => {
  return await bcrypt.compare(token, hashedToken);
};