import { IUpsertCredentialsRequest } from '@customTypes/user';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { createSalt, hashPassword } from '@utils/authentication';

const prisma = new PrismaClient();

export class User {
  public async UpsertCredentials(
    user: IUpsertCredentialsRequest
  ): Promise<void> {
    const salt = createSalt();
    const hashedPassword = await hashPassword(user.password, salt);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        salt: salt,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        salt: salt,
      },
      select: null,
    });
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
