import {DateUtils} from './Date';
//import * as  LZString from 'lz-string';

export class LocalStorage {
    public static setObject(key: string, value: any) {        
        //LZString.compressToUTF16(value);
        localStorage.setItem(key, JSON.stringify(value));
    }

    public static getObject<T>(key: string): T {
        let value = localStorage.getItem(key);
        return <T>(value && JSON.parse(value, DateUtils.dateParser));
    }
}