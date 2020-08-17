import { Test } from "./test.interface";

export interface Group {
    id: number,
    title: string,
    testIds?: Array<number | Test>,
    tests?: Array<Test>,
    price: number,
    totalTestsInGroupCount: number,
    matchedTestsCount: number, 
    leftTestsCount: number,
    countOfOtherTests: number
  }