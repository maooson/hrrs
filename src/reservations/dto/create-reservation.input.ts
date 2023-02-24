import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field()
  @IsNotEmpty()
  tableSize: string;

  @Field()
  @IsNotEmpty()
  expectedArrivalTime: Date;

  @Field()
  @IsNotEmpty()
  status: string
}
