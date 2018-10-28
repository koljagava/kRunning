import {DateUtils} from './Date';
import {Configuration} from '../Configuration';

export class BmiClass {
    public descr: string;
    public min: number;
    public max: number;

    public constructor(descr: string, min: number, max: number) {
        this.descr = descr;
        this.min = min;
        this.max = max;
    }
}

export class Converter {
    public static bmiClasses: Array<BmiClass> = [new BmiClass('Sottopeso', 0, 18.5),
                              new BmiClass('Normopeso', 18.5, 25),
                              new BmiClass('Sovrappeso', 25, 30),
                              new BmiClass('Obesità di classe I (moderata)', 30, 35),
                              new BmiClass('Obesità di classe II', 35, 40),
                              new BmiClass('Obesità di classe III', 40, 99999)
                            ];

    public static getPaceFromSpeed(speed: number): Date {
        if (speed == null || speed === 0) {
            return new Date(0);
        }

        if (speed < 0) {
            throw new Error('speed can not be negative');
        }

        const pace = new Date(new Date(0).getTime() + ((60 / speed) * 60000));
        return pace;
    }

    public static convertSpeedFromMeterPerSeconds(speed: number) {
        if (speed == null || speed === 0) {
            return 0;
        }
        return speed * Configuration.globals.speed[Configuration.unit];
    }

    public static toRadians(num: number): number {
        return num * Math.PI / 180;
    }

    public static toDegrees(num: number): number {
        return num * 180 / Math.PI;
    }

    public static bmiClaculator(highInCm: number, weightInKg: number): number {
        if (highInCm == null || weightInKg == null) {
            return null;
        }
        return weightInKg / Math.pow(highInCm / 100, 2);
    }

    public static getBmiClass(bmi: number): BmiClass {
        if (bmi == null) {
            return null;
        }
        return Converter.bmiClasses.find((bmic: BmiClass) => {
            return bmic.min <= bmi && bmic.max > bmi;
        });
    }

    public static standardWeigth(highInCm: number): number {
        if (highInCm == null) {
            return null;
        }
        return (Math.pow(highInCm / 100, 2) * 2490) / 100;
    }
/*
    public static cloneObject<T>(obj: any): T {
        let objType = typeof obj;
        if (obj == null || typeof obj !== 'object' && objType !== 'array') return <T>obj;
        if (objType === 'date' || objType === 'regexp' || objType === 'function' ||
            objType === 'string' || objType === 'number' || objType === 'boolean')
            return <T>Object.assign({}, obj);

        let cloneObj = Object.assign({}, obj);

        for (let name in obj) {
            cloneObj[name] = Converter.cloneObject(obj[name]);
        }
        return cloneObj;
    }
*/
    public static cloneObject<T>(obj: any): T {
        if (!obj) {
            return obj;
        }
        const types = [Number, String, Boolean];
        let result: any;

        // normalizing primitives if someone did new String('aaa'), or new Number('444');
        types.forEach(function(type) {
            if (obj instanceof type) {
                return type(obj);
            }
        });

        if (obj instanceof Array) {
            result = new Array();
            obj.forEach(function(child, index, array) {
                result[index] = Converter.cloneObject(child);
            });
        } else if (typeof obj === 'object') {
            // testing that this is DOM
            if (obj.nodeType && typeof obj.cloneNode === 'function') {
                result = obj.cloneNode( true );
            } else if (!obj.prototype) { // check that this is a literal
                if (obj instanceof Date) {
                    result = new Date(obj);
                } else {
                    // it is an object literal
                    result = {};
                    // tslint:disable-next-line:forin
                    for (const i in obj) {
                        result[i] = Converter.cloneObject(obj[i]);
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (obj.constructor !== undefined) {
                    // would not advice to do that, reason? Read below
                    result = new obj.constructor();
                } else {
                    result = obj;
                }
            }
        } else {
            result = obj;
        }

        return result;
    }
}
