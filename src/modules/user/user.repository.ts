import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';

@Injectable()
export class UserRepository {
  async findUserById(userId: number) {
    try {
      const query = `
        SELECT u.email,u.id,u.first_name,u.last_name,u.phone,r.id as role_id, r.name as role_name,r.workspace
        FROM public.user AS u
        INNER JOIN role as r on u.role_id = r.id
        WHERE u.id = $1
    `;
      const result = await AppDataSource.query(query, [userId]);

      if (result.length === 0) {
        return null;
      }
      const {
        id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        workspace,
        role_id: roleId,
        role_name,
      } = result[0];

      return {
        email,
        userId: id,
        firstName,
        lastName,
        phone,
        workspace,
        roleId,
        role: role_name,
      };
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }
}
