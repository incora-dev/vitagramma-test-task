import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { GroupEntity } from '@best-price-app/modules/group/entities/group.entity';
import { UtilsService } from '@best-price-app/utils/services';
 
export default class GroupSeeder implements Seeder {  
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const groups = await UtilsService.parseCSV('csv/groups.csv', true);

    await connection
      .createQueryBuilder()
      .insert()
      .into(GroupEntity, ['id', 'uuid', 'title', 'price'])
      .values(groups)
      .orIgnore()
      .execute()
  }
}