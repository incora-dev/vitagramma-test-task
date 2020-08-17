import { GroupEntity } from '@best-price-app/modules/group/entities/group.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {}