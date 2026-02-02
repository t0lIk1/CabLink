import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from 'src/database/database.service';
import { users } from 'src/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private drizzle: DrizzleService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;

    const db = this.drizzle.getDb();
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
      })
      .returning();

    return newUser;
  }

  async findAll() {
    const db = this.drizzle.getDb();
    return await db.query.users.findMany();
  }

  async findOne(id: string) {
    const db = this.drizzle.getDb();
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async findOneByEmail(email: string) {
    const db = this.drizzle.getDb();
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const db = this.drizzle.getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { email, password, name } = updateUserDto;
    const updateData: any = {};

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      updateData.password = await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async remove(id: string) {
    const db = this.drizzle.getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return deletedUser;
  }
}
