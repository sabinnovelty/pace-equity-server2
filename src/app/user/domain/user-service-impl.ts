import { User } from './core/entities/user';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user';
import { UpdateUserDto } from './dtos/update-user';
import { UserQueryOptions } from './dtos/user-query';
import { ProjectModule } from '../../../shared/enum';
import { errorMessage } from '../../../shared/constants';
import { UserService } from './abstractions/user-service';
import { formatModuleMessage } from '../../../shared/utils';
import { NotFoundException } from '../../../shared/exception';
import { UserRepository } from '../repository/abstractions/user-repository';
import { FindAllResponse, CountResponse, ServiceOption } from '../../../shared/types';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createDto: CreateUserDto, option: ServiceOption): Promise<User> {
    const user = new User(createDto);

    const createdUser = await this.userRepository.create(user, option);

    return createdUser;
  }

  //#region Get
  async count(query: UserQueryOptions, option?: ServiceOption): Promise<CountResponse> {
    return await this.userRepository.count(query, option);
  }

  async get(query: UserQueryOptions, option: ServiceOption): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<User> {
    const user = await this.userRepository.findOneById(id, option);
    if (!user)
      throw new NotFoundException(
        formatModuleMessage(errorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return user;
  }

  async updateById(id: string, updateDto: UpdateUserDto, option: ServiceOption): Promise<User> {
    const updatedUser = await this.userRepository.updateById(id, updateDto, option);
    if (!updatedUser)
      throw new NotFoundException(
        formatModuleMessage(errorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return updatedUser;
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.userRepository.deleteById(id, option);
  }
}
