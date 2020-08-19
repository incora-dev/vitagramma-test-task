import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export class UtilsService {
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: any,
  ): T;
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: any,
  ): T[];
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: any, // To-Do: E | E[]
    options?: any,
  ): T | T[] {
    if (_.isArray(entity)) {
      return _.map(entity, (u) => new model(u, options));
    }

    return new model(entity, options);
  }

  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '');
  }

  static generateRandomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .toUpperCase()
      .substr(0, length);
  }

  static getAge(d1: Date, d2?: Date): number {
    d2 = d2 || new Date();
    const diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  static capitalizeName(name: string): string {
    return _.capitalize(name);
  }

  static readableToString(stream, withUuid) {
    const results = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (item) => {
        if (withUuid) item.uuid = uuidv4();
        results.push(item);
      });
      stream.on('end', () => resolve(results));
      stream.on('error', (err) => reject(err));
    });
  }

  static async parseCSV(path: string, withUuid: boolean) {
    const csv = require('csv-parser')
    const fs = require('fs')

    const stream = fs.createReadStream(path).pipe(csv());
    return this.readableToString(stream, withUuid).then((response) => response);
  }
}