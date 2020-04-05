import { Module } from '@nestjs/common';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';
import { OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),

  ],
  providers: [PurchaseResolver, PurchaseService]
})
export class PurchaseModule { }
