import { PrismaClient } from '@prisma/client';

import { ICreateUserProps } from '../../@types/database/user';
import { createSalt, hashPassword } from '../authentication';

const prisma = new PrismaClient();

export class User {
  public async Create(
    user: ICreateUserProps
  ): Promise<{ user?: ICreateUserProps; error?: string }> {
    const existingUsersCount = await prisma.user.count({
      where: {
        email: user.email,
      },
    });
    if (existingUsersCount)
      return { error: 'User with this email already exists' };

    const salt = createSalt();
    const hashedPassword = await hashPassword(user.password, salt);
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        salt: salt,
        admin: Boolean(user.admin) ?? false,
      },
    });
    return {
      user: {
        email: createdUser.email,
        password: createdUser.password,
        admin: createdUser.admin,
      },
    };
  }
}
