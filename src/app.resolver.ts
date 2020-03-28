import { Resolver, Query } from '@nestjs/graphql';

@Resolver('App')
export class AppResolver {
    @Query('hello')
    async hello() {
        return { message: 'hello' }
    }
}
