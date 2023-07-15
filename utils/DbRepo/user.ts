import {
  ICredentailsRequest as ICredentailsRequest,
  IUpdateRequest,
} from '@customTypes/messages/user';
import { User as PrismaUser } from '@prisma/client';
import { createSalt, hashPassword } from '@utils/authentication';

import { DbRepo } from '.';

export class User {
  public static async Create(user: ICredentailsRequest): Promise<PrismaUser> {
    const salt = createSalt();
    const hashedPassword = await hashPassword(user.password, salt);
    return await DbRepo.Client.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        salt: salt,
      },
    });
  }
  public static async GetSingleFromEmail(
    email: string
  ): Promise<PrismaUser | null> {
    const user = await DbRepo.Client.user.findFirst({
      where: { email },
    });
    return user;
  }
  public static async GetSingle(id: string): Promise<PrismaUser | null> {
    return await DbRepo.Client.user.findFirst({ where: { id } });
  }
  public static async GetAll(): Promise<PrismaUser[]> {
    return await DbRepo.Client.user.findMany();
  }
  public static async Update(
    id: string,
    user: IUpdateRequest
  ): Promise<PrismaUser> {
    let hashedPassword: string | undefined;
    let salt: string | undefined;
    if (user.password) {
      salt = createSalt();
      hashedPassword = await hashPassword(user.password, salt);
    }
    const updatedUser = await DbRepo.Client.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
        email: user.email,
        salt: salt,
      },
    });
    return updatedUser;
  }
  public static async ValidateCredentials(
    email: string,
    password: string
  ): Promise<boolean> {
    const user = await DbRepo.Client.user.findUniqueOrThrow({
      where: { email },
      select: { password: true, salt: true, enabled: true },
    });
    if (!user.password || !user.salt || !user.enabled) return false;

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.password) return false;
    return true;
  }
  public static async Delete(id: string): Promise<void> {
    await DbRepo.Client.user.delete({ where: { id } });
  }
}
