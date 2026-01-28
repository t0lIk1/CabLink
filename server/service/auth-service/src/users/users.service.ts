import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const createData: any = {
      email,
      password: hashedPassword,
      name,
    };
    if (role) {
      createData.role = role;
    }
    return await this.prisma.user.create({
      data: createData,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { email, password, name } = updateUserDto;
    let hashedPassword = password;
    if (password)
      hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    return await this.prisma.user.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.prisma.user.delete({ where: { id } });
  }
}
