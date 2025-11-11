import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    Logger.log('Connecting to the database...');
    await this.$connect();
    Logger.log('Connected to the database');
  }

  public async onModuleDestroy() {
    Logger.log('Disconnecting from the database...');
    await this.$disconnect();
    Logger.log('Database disconnected.');
  }
}
