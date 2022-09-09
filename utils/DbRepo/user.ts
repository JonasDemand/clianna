import {
  ICredentailsRequest as ICredentailsRequest,
  IUpdateUserRequest,
} from '@customTypes/messages/user';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { createSalt, hashPassword } from '@utils/authentication';

import { DbRepo } from '.';

const prisma = new PrismaClient();

export class User {
  private UserId: string;
  public constructor(userId: string) {
    this.UserId = userId;
  }

  public async CreateCredentials(user: ICredentailsRequest): Promise<void> {
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
  public async GetIdFromEmail(email: string): Promise<string> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });
    return user.id;
  }
  public async GetAll() {
    return await prisma.user.findMany();
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
  public async ValidateCredentials(password: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: this.UserId },
      select: { password: true, salt: true },
    });
    if (!user.password || !user.salt) return false;

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.password) return false;
    return true;
  }
  public async MigrateFromId(id: string) {
    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: this.UserId },
    });
    const customers = await DbRepo.Instance.Customer.GetAll(false);
    const orders = await DbRepo.Instance.Order.GetAll(false);
    await prisma.user.update({
      where: { id },
      data: {
        googleId: currentUser.googleId,
        refreshToken: currentUser.refreshToken,
        Customer: { connect: customers.map((x) => ({ id: x.id })) },
        Order: { connect: orders.map((x) => ({ id: x.id })) },
        //TODO: Add documents
      },
    });
  }
}
