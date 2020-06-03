import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PurchaseService } from './purchase.service';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Resolver('Purchase')
export class PurchaseResolver {
    constructor(private readonly purchaseService: PurchaseService) { }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query()
    async getOrders() {
        return await this.purchaseService.findAllOrders();
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('Order')
    async findOneOrderById(@Args('id') id: string): Promise<any> {
        return await this.purchaseService.findOneOrderById(id);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('deleteOrder')
    async deleteOrder(@Args('id') id: string): Promise<any> {
        return await this.purchaseService.deleteOrder(id);
    }
    @Mutation('createOrder')
    async createOrder(@Args('createOrderInput') args: any): Promise<any> {
        return await this.purchaseService.createOrder(args);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('updateOrder')
    async updateOrder(@Args('updateOrderInput') args: any): Promise<any> {
        return await this.purchaseService.updateOrder(args, args.id);
    }
}
