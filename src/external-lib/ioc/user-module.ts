import { Module } from '@nestjs/common';
import { UserModel } from '../../app/user/repository/models/user-model';
import { UserServiceImpl } from '../../app/user/domain/user-service-impl';
import { UserController } from '../../app/user/controllers/user-controller';
import { UserService } from '../../app/user/domain/abstractions/user-service';
import { UserRepositoryImpl } from '../../app/user/repository/user-repository-impl';
import { UserPresenter } from '../../app/user/presenters/abstractions/user-presenter';
import { UserRepository } from '../../app/user/repository/abstractions/user-repository';
import { DefaultUserPresenter } from '../../app/user/presenters/default-user-presenter';
import { UserPersistenceMapper } from '../../app/user/repository/mappers/user-persistence-mapper';

@Module({
  controllers: [UserController],
  providers: [
    UserModel,
    UserPersistenceMapper,
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: UserPresenter,
      useClass: DefaultUserPresenter,
    },
  ],
})
export class UserModule {}
