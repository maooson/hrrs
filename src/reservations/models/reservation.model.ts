import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';


@ObjectType()
export class Reservation extends BaseModel {
  @Field(() => String, { nullable: false })
  tableSize: String;

  @Field(() => Date, { nullable: false })
  expectedArrivalTime: Date;

  @Field(() => String, { nullable: false })
  status: String;

  @Field(() => User, { nullable: false })
  guest: User;
}
