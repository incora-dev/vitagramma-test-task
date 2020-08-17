import * as _ from "lodash";

import { Queue } from '@lib/item-package-combination/classes/queue.class';
import { RelevantItem } from '@lib/item-package-combination/classes/relevant-item.class';
import { Group } from '@best-price-app/interfaces';
import { SelectedTests } from '@lib/item-package-combination/interfaces/selected-tests.interface';

export class RelevantItemGroupsAlgorithm {

    readonly BRUTE_LIMIT = 30;
    readonly DP_LIMIT = 20;
    readonly SIMILARUTY_LIMIT = 0.5;
    readonly DUPLICATION_LIMIT = 0.25;

    public selectedTests: SelectedTests;
    public limit: number;
    private _bestItems: Array<RelevantItem> = [];

    constructor(selectedTests: SelectedTests, limit: number) {
      this.selectedTests = selectedTests;
      this.limit = limit;
    }
    
    private _saveItemToResults(data: Object): void { 
      this._bestItems.push(new RelevantItem(data));
    }

    private _isSimilarByBonuses(selectedItem: RelevantItem, relevantItems: Array<RelevantItem>): Boolean {
      let similarAlreadyExists = false;
      if (selectedItem.bonus.length) {
        _.forEach(relevantItems, (topItem) => {
          if (_.isEqual(selectedItem.bonus, topItem.bonus)) {
            similarAlreadyExists = true;
          }
        });
      }
      return similarAlreadyExists;
    }

    private _isCompletelySame(group: Group): Boolean {
      return (this.selectedTests.ids.length === group.totalTestsInGroupCount) && (this.selectedTests.ids.length === group.matchedTestsCount) && !group.leftTestsCount && !group.countOfOtherTests;
    }

    private _isSamePlusBonus(group: Group): Boolean {
      return (this.selectedTests.ids.length === group.matchedTestsCount) && (group.totalTestsInGroupCount > this.selectedTests.ids.length);
    }
    
    private _getTopNItems(relevantItems: Array<RelevantItem>, limit: Number): Array<RelevantItem> {
      let topItems = [];
      let sortedItems =_.sortBy(relevantItems, ['totalPrice']);
      _.forEach(sortedItems, (relevantItem) => {
        if (!this._isSimilarByBonuses(relevantItem, topItems)) topItems.push(relevantItem);
      });
      return _.take(topItems, limit);
    }

    private _addLeftTests(relevantItems: Array<RelevantItem>): void {
      _.forEach(relevantItems, (relevantItem) => {
        let leftTestIds = _.map(relevantItem.groups, (group) => group.testIds);
        leftTestIds = _.difference(this.selectedTests.ids, _.uniq(_.flattenDeep(leftTestIds)));
        let leftTestData = _.map(leftTestIds, (id) => {
          return _.find(this.selectedTests.data, function(test) { return test.id === id; });
        });
        relevantItem.save({ tests: leftTestData });
      });
    }

    solve(matchedGroups: Array<Group>, testForSearch: SelectedTests) {
      let matchedGroupsQueue = new Queue<Group>();
      _.forEach(matchedGroups, (group) => matchedGroupsQueue.push(group)); 
      if (!testForSearch.ids.length && !matchedGroupsQueue.length()) return []; // add if groups 0!!!!!!!!!!!
      if (!matchedGroupsQueue.length()) {
        this._saveItemToResults({ tests: testForSearch.data });
        return this._getTopNItems(this._bestItems, this.limit);
      }

      this._generateOptions(matchedGroupsQueue, testForSearch);
      return this._getTopNItems(this._bestItems, this.limit);
    }

    private _generateOptions(matchedGroupsQueue: Queue<Group>, testForSearch: SelectedTests) {
      // return this.generateDP(matchedGroupsQueue, testForSearch);
      if (matchedGroupsQueue.length() <= this.BRUTE_LIMIT) {
        return this.generateBrute(matchedGroupsQueue, testForSearch);
      } else {
        if (testForSearch.ids.length <= this.DP_LIMIT) {
          return this.generateDP(matchedGroupsQueue, testForSearch);
        } else {
          return this.generateGreedy(matchedGroupsQueue, testForSearch);
        }   
      }  
    }
    
    generateBrute(
        matchedGroupsQueue: Queue<Group>, 
        testForSearch: SelectedTests, 
        usedTests: Array<number> = [], 
        selectedGroups: Array<Group> = []
    ) : void {

        let group = matchedGroupsQueue.pop();
        while (group) {
        if (this._isSamePlusBonus(group) && !usedTests.length) {
          this._saveItemToResults({ 
            groups: [group],
            bonus: _.difference(group.testIds, this.selectedTests.ids)
          });
        } else {
          if (this._isCompletelySame(group)) {  
            this._saveItemToResults({ groups: [group] });
          } else {
            if (!_.intersection(group.testIds, usedTests).length) {
                let idsForSearch = _.difference(testForSearch.ids, group.testIds);
                if (idsForSearch.length) {
                  this.generateBrute(
                    matchedGroupsQueue.clone(), 
                    {
                        ids: idsForSearch,
                        data: _.map(idsForSearch, (id) => _.find(testForSearch.data, {id: id}))
                    }, 
                    _.concat(usedTests, _.intersection(testForSearch.ids, group.testIds)), 
                    _.concat(selectedGroups, [group])
                  );  
                } else {
                  testForSearch = {
                    ids: [],
                    data: []
                  }
                  usedTests = _.concat(usedTests, group.testIds);
                  selectedGroups.push(group);
                }
            }
          }
        }
        group = matchedGroupsQueue.pop();
      }
      if (selectedGroups.length || testForSearch.data.length) {
        if (_.intersection(_.concat(usedTests, testForSearch.ids), this.selectedTests.ids).length === this.selectedTests.ids.length) {
          let allGroupTests = _.flattenDeep(_.map(selectedGroups, 'testIds'));
          this._saveItemToResults({ 
            groups: selectedGroups.length ? selectedGroups : [],
            tests: testForSearch.data.length ? testForSearch.data : [],
            bonus: _.difference(allGroupTests, this.selectedTests.ids)
          });
        }
      }
    }

    generateDP(matchedGroupsQueue: Queue<Group>, testForSearch: SelectedTests): void {
      const DP = [];
      for(let i = 0; i < (1 << testForSearch.ids.length); ++i) {
        DP.push([]);
      }
      DP[0].push(new RelevantItem());
      let group = matchedGroupsQueue.pop();
      while (group) {
        let groupMask = 0;
        testForSearch.ids.forEach(testId => {
          groupMask = 2 * groupMask + Number(group.testIds.includes(testId));
        });
        if (groupMask != 0) {
          for(let mask = 0; mask < (1 << testForSearch.ids.length); ++mask) {
            DP[mask].forEach(item => {
              if ((mask | groupMask) !== mask) {
                let newItem = item.clone();
                newItem.save({ 
                  groups: [group], 
                  bonus: _.difference(group.testIds, this.selectedTests.ids) 
                });
                let nextDP = DP[mask | groupMask];
                nextDP.push(newItem);
                if (nextDP.length > this.limit) {
                  DP[mask | groupMask] = this._getTopNItems(nextDP, this.limit);
                }
              }
            })
          }
        }
        group = matchedGroupsQueue.pop();
      }
      _.forEach(DP, (DPItem) => this._addLeftTests(DPItem));
      this._bestItems = _.flatten(DP);
      this._bestItems = _.filter(this._bestItems, (relevantItem) => {
        let relevantItemTestIds =  _.flattenDeep(_.map(relevantItem.groups, (group) => group.testIds));
        let relevantItemUniqueTestIds = _.uniq(relevantItemTestIds);
        return ((relevantItemTestIds.length - relevantItemUniqueTestIds.length) / this.selectedTests.ids.length <= this.DUPLICATION_LIMIT);
      });
    }

    generateGreedy(matchedGroupsQueue: Queue<Group>, testForSearch: SelectedTests): void {
      let newPacks = [];
      let relevantGroups = [];
      let group = matchedGroupsQueue.pop();
      relevantGroups.push(group);
      while (group) {
        if (newPacks.length < this.BRUTE_LIMIT) {
          let similarExist = false;
          _.forEach(newPacks, selectedGroup => {
            let intersectionSize = _.intersection(group.testIds, selectedGroup.testIds).length;
            if (intersectionSize / group.testIds.length > this.SIMILARUTY_LIMIT) {
              similarExist = true;
            }
          })
          if (!similarExist) {
            newPacks.push(group);
          }
        }
        group = matchedGroupsQueue.pop();
        relevantGroups.push(group);
      }
      _.forEach(relevantGroups, group => {
        if (newPacks.length < this.BRUTE_LIMIT && !newPacks.includes(group)){
          newPacks.push(group);
        }
      });
      matchedGroupsQueue = new Queue<Group>();
      _.forEach(newPacks, (group) => matchedGroupsQueue.push(group)); 
      this.generateBrute(matchedGroupsQueue, testForSearch);
    }
}
