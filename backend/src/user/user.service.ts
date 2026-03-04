import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

async create(data: { username: string; password: string }) {
  const existing = await this.prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existing) {
    throw new ConflictException('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return this.prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });
}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    data: { username?: string; password?: string },
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}