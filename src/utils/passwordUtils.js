
import bcrypt, { hashSync } from "bcryptjs";

export const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}


export const comparePasswords = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}