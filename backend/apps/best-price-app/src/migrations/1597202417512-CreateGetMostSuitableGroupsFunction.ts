import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateGetMostSuitableGroupsFunction1597202417512 implements MigrationInterface {
    name = 'CreateGetMostSuitableGroupsFunction1597202417512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP FUNCTION IF EXISTS get_most_suitable_groups(bigint[], integer, integer);

            CREATE OR REPLACE FUNCTION get_most_suitable_groups(
                IN _testIds bigint[],
                IN _maxExtraTestsPercent integer DEFAULT 100,
                IN _minMatchedTestsPercent integer DEFAULT 50
            )
            RETURNS TABLE("groupsId" bigint, "title" character varying, "price" numeric, "totalTestsInGroupCount" bigint, "matchedTestsCount" bigint, "leftTestsCount" bigint, "countOfOtherTests" bigint, "testIds" bigint[])
            AS $BODY$
                DECLARE
                    _minMatchedTestsCount integer;
                    _maxExtraTestsCount integer;
                begin
                    SELECT FLOOR(_minMatchedTestsPercent::numeric / 100 * CARDINALITY(_testIds)) into _minMatchedTestsCount;
                    SELECT FLOOR(_maxExtraTestsPercent::numeric / 100 * CARDINALITY(_testIds)) into _maxExtraTestsCount;
                    return query
                        SELECT DISTINCT 
                            gt."groupsId", 
                            g.title, 
                            g.price, 
                            totalTable.totalTestsInGroupCount, 
                            gt.matchedTestsCount,  
                            (CARDINALITY(_testIds) - gt.matchedTestsCount) as leftTestsCount,
                            (totalTable.totalTestsInGroupCount - gt.matchedTestsCount) as countOfOtherTests,
                            testIds
                        FROM (
                            SELECT groups_tests_tests."groupsId", COUNT(*) as matchedTestsCount
                            FROM groups_tests_tests
                                WHERE "testsId" = ANY(_testIds)
                                GROUP BY groups_tests_tests."groupsId"
                                HAVING COUNT(*) >= _minMatchedTestsCount
                            ) AS gt JOIN groups AS g ON gt."groupsId" = g.id
                            JOIN (
                                SELECT groups_tests_tests."groupsId", COUNT(*) as totalTestsInGroupCount, array_agg(DISTINCT "testsId") AS testIds
                                FROM groups_tests_tests 
                                GROUP BY groups_tests_tests."groupsId"
                            ) AS totalTable
                            ON gt."groupsId" = totalTable."groupsId"
                            WHERE (totalTable.totalTestsInGroupCount - gt.matchedTestsCount) <= _maxExtraTestsCount
                            AND (CARDINALITY(_testIds) + totalTable.totalTestsInGroupCount - 2 * gt.matchedTestsCount) <= _maxExtraTestsCount
                            ORDER BY countOfOtherTests ASC, gt.matchedTestsCount DESC;
                end;
            $BODY$
            LANGUAGE plpgsql VOLATILE
            COST 100;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS get_most_suitable_groups(bigint[], integer, integer);`);
    }

}
