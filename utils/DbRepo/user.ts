import { ICreateUserProps } from '@customTypes/database/user';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

const prisma = new PrismaClient();

export class User {
  public async Create(user: ICreateUserProps): Promise<ICreateUserProps> {
    throw new Error('not Implemented');
    /*const existingUsersCount = await prisma.user.count({
      where: {
        email: user.email,
      },
    });
    if (existingUsersCount)
      throw new Error('User with that email already exists');

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
      email: createdUser.email,
      password: createdUser.password,
      admin: createdUser.admin,
    };*/
  }
  public async GetAll(): Promise<PrismaUser[]> {
    return await prisma.user.findMany();
  }
  public async GetSingle() {
    throw new Error('not Implemented');
  }
  public async Update() {
    throw new Error('not Implemented');
  }
  public async Delete() {
    throw new Error('not Implemented');
  }
}
