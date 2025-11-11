import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  save(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        role: ['USER'],
      },
    });
  }

  async findOne(idOrEmail: string) {
    const result = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });

    if (!result) {
      throw new BadRequestException('User not found');
    }

    return result;
  }

  async delete(id: string) {
    const search = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!search) {
      throw new BadRequestException('User not found');
    }

    return this.prismaService.user.delete({
      where: { id },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
