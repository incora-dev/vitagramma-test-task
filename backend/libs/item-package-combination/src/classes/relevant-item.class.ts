import * as _ from "lodash";

import { Group, Test } from '@best-price-app/interfaces';

enum DataTypes {
    groups,
    tests,
    bonus
  }

export class RelevantItem {
    groups?: Array<Group> = [];
    tests?: Array<Test> = [];
    bonus?: Array<Number | Test> = [];
    totalPrice?: number = 0;

    constructor(data: Object = {}){
      this.save(data);
    }
    
    private _insertItems (data: Array<Group> | Array<Test>, type: string): void { 
      _.forEach(data, (item) => {
        if (_.indexOf(this[type], item) === -1) {
          this[type].push(item);
          if (item.price && type !== 'bonus') this.totalPrice += item.price;
        }
      });
    }
    
    public save(data: Object): void { // fix it
      for (let type in DataTypes) {
          if (data[type]) this._insertItems(data[type], type);
      }
    }

    clone(): RelevantItem {
      let item = new RelevantItem();
      let data = {
        groups: this.groups,
        tests: this.tests,
        bonus: this.bonus
      }
      item.save(data);
      return item;
    }
  }