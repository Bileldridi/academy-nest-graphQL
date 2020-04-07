import { Module } from '@nestjs/common';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';
import { OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CemeterySchema } from '../common/schemas/cemetery.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { AccessSchema } from '../courses/schemas/access.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Cemetery', schema: CemeterySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Access', schema: AccessSchema }]),
  ],
  providers: [PurchaseResolver, PurchaseService]
})
export class PurchaseModule { }
