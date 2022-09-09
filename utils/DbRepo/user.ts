import {
  ICreateCredentialsRequest as ICreateCredentialsRequest,
  IUpdateUserRequest,
} from '@customTypes/messages/user';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { createSalt, hashPassword } from '@utils/authentication';

const prisma = new PrismaClient();

export class User {
  private UserId: string;
  public constructor(userId: string) {
    this.UserId = userId;
  }

  public async CreateCredentials(
    user: ICreateCredentialsRequest
  ): Promise<void> {
    const salt = createSalt();
    const hashedPassword = await hashPassword(user.password, salt);
    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        salt: salt,
      },
      select: null,
    });
  }

  public async GetSingle() {
    throw new Error('not Implemented');
  }
  public async Update(user: IUpdateUserRequest): Promise<PrismaUser> {
    let hashedPassword: string | undefined;
    let salt: string | undefined;
    if (user.password) {
      salt = createSalt();
      hashedPassword = await hashPassword(user.password, salt);
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: this.UserId,
      },
      data: {
        password: hashedPassword,
        email: user.email,
        salt: salt,
        cliannaFolderId: user.cliannaFolderId,
      },
    });
    return updatedUser;
  }
  public async Delete() {
    throw new Error('not Implemented');
  }
}
