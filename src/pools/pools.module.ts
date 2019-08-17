import { Module } from '@nestjs/common';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';
import { PoolsResolver } from './pools.resolver';

@Module({
  controllers: [PoolsController],
  providers: [PoolsService, PoolsResolver],
})
export class PoolsModule { }
