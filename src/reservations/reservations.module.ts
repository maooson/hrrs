import { Module } from '@nestjs/common';
import { ReservationsResolver } from './reservations.resolver';

@Module({
  imports: [],
  providers: [ReservationsResolver],
})
export class ReservationsModule {}
