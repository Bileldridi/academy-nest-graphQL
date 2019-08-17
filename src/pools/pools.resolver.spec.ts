import { Test, TestingModule } from '@nestjs/testing';
import { PoolsResolver } from './pools.resolver';

describe('PoolsResolver', () => {
  let resolver: PoolsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolsResolver],
    }).compile();

    resolver = module.get<PoolsResolver>(PoolsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
