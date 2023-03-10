import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ChangeStatusInput {
  @Field()
  @IsNotEmpty()
  status: string;
}
