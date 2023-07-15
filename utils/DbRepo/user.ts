import {
  ICredentailsRequest as ICredentailsRequest,
  IUpdateRequest,
} from '@customTypes/messages/user';
import { User as PrismaUser } from '@prisma/client';
import { createSalt, hashPassword } from '@utils/authentication';
import prisma from '@utils/prisma';

export class User {
  public static async Create(user: ICredentailsRequest): Promise<PrismaUser> {
    const salt = createSalt();
    const hashedPassword = await hashPassword(user.password, salt);
    return await prisma.user.create({
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
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user;
  }
  public static async GetSingle(id: string): Promise<PrismaUser | null> {
    return await prisma.user.findFirst({ where: { id } });
  }
  public static async GetAll(): Promise<PrismaUser[]> {
    return await prisma.user.findMany();
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
    const updatedUser = await prisma.user.update({
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
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { password: true, salt: true, enabled: true },
    });
    if (!user.password || !user.salt || !user.enabled) return false;

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.password) return false;
    return true;
  }
  public static async Delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
