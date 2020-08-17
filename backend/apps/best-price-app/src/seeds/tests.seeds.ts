import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { TestEntity } from '@best-price-app/modules/test/entities/test.entity';
import { GroupEntity } from '@best-price-app/modules/group/entities';
import { UtilsService } from '@best-price-app/utils/services';
 
export default class TestSeeder implements Seeder {  
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const tests = await UtilsService.parseCSV('csv/tests.csv', true);

    await connection
      .createQueryBuilder()
      .insert()
      .into(TestEntity, ['id', 'uuid', 'title', 'price'])
      .values(tests)
      .orIgnore()
      .execute()

    const groups = await UtilsService.parseCSV('csv/groups.csv', true);
    const groupsTests = await UtilsService.parseCSV('csv/groups-tests.csv', false);
    const validGroupTests = (groupsTests as []).filter(({ GroupsId: groupsId, TestsId: testsId }) => (
      (tests as TestEntity[]).some(test => testsId === test.id)
      && (groups as GroupEntity[]).some(group => groupsId === group.id)
    ));

    await connection
      .createQueryBuilder()
      .insert()
      .into('groups_tests_tests')
      .values(validGroupTests.map(({ GroupsId: groupsId, TestsId: testsId }) => ({ groupsId, testsId })))
      .orIgnore()
      .execute()
  }
}
