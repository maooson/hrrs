import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation
} from '@nestjs/graphql';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { ReservationIdArgs } from './args/reservation-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Reservation } from './models/reservation.model';
import { ReservationConnection } from './models/reservation-connection.model';
import { CreateReservationInput } from './dto/create-reservation.input';
import { ChangeStatusInput } from './dto/change-status.input';

const pubSub = new PubSub();

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private prisma: PrismaService) { }

  @Subscription(() => Reservation)
  reservationCreated() {
    return pubSub.asyncIterator('reservationCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Reservation)
  async createReservation(
    @UserEntity() user: User,
    @Args('data') data: CreateReservationInput
  ) {
    const newReservation = this.prisma.reservation.create({
      data: {
        tableSize: data.tableSize,
        expectedArrivalTime: data.expectedArrivalTime,
        status: data.status,
        guestId: user.id,
      },
    });
    pubSub.publish('reservationCreated', { reservationCreated: newReservation });
    return newReservation;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Reservation)
  async updateReservation(
    @Args() id: ReservationIdArgs,
    @Args('data') data: ChangeStatusInput
  ) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id: id.reservationId } });

    if (reservation && reservation.status !== data.status) {
      this.prisma.reservation.update({
        data: data,
        where: {
          id: id.reservationId
        },
      });
    }
  }

  @Query(() => ReservationConnection)
  async allReservations(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({
      name: 'filterBy',
      type: () => String,
      nullable: true,
    })
    filterBy: string
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.reservation.findMany({
          include: { guest: true },
          where: filterBy ? {
            status: { equals: filterBy },
          } : {},
          ...args,
        }),
      () =>
        this.prisma.reservation.count({
          where: filterBy ? {
            status: { equals: filterBy },
          } : {},
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query(() => [Reservation])
  userReservations(@Args() id: UserIdArgs,
    @Args({
      name: 'filterBy',
      type: () => String,
      nullable: true,
    })
    filterBy: string) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .reservations({
        where: filterBy ? {
          status: { equals: filterBy },
        } : {},
      });
  }

  @Query(() => Reservation)
  async reservation(@Args() id: ReservationIdArgs) {
    return this.prisma.reservation.findUnique({ where: { id: id.reservationId } });
  }

  @ResolveField('guest', () => User)
  async guest(@Parent() reservation: Reservation) {
    return this.prisma.reservation.findUnique({ where: { id: reservation.id } }).guest();
  }
}
