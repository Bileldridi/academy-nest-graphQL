import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PurchaseService } from './purchase.service';

@Resolver('Purchase')
export class PurchaseResolver {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Query()
    async getOrders() {
        return await this.purchaseService.findAllOrders();
    }
    @Query('Order')
    async findOneOrderById(@Args('id') id: string): Promise<any> {
        return await this.purchaseService.findOneOrderById(id);
    }
    @Query('deleteOrder')
    async deleteOrder(@Args('id') id: string): Promise<any> {
        return await this.purchaseService.deleteOrder(id);
    }
    @Mutation('createOrder')
    async createOrder(@Args('createOrderInput') args: any): Promise<any> {
        return await this.purchaseService.createOrder(args);
    }
    @Mutation('updateOrder')
    async updateOrder(@Args('updateOrderInput') args: any): Promise<any> {
        return await this.purchaseService.updateOrder(args, args.id);
    }
}
