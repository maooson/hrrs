import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Reservation } from './reservation.model';

@ObjectType()
export class ReservationConnection extends PaginatedResponse(Reservation) {}
