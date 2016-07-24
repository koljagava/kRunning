import {DateUtils} from "./Date";
import {Configuration} from "../Configuration";

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
    public static bmiClasses: Array<BmiClass> = [new BmiClass("Sottopeso", 0, 18.5),
                              new BmiClass("Normopeso", 18.5, 25),
                              new BmiClass("Sovrappeso", 25, 30),
                              new BmiClass("Obesità di classe I (moderata)", 30, 35),
                              new BmiClass("Obesità di classe II", 35, 40),
                              new BmiClass("Obesità di classe III", 40, 99999)
                            ];

    public static getPaceFromSpeed(speed: number): Date {
        if (speed == null || speed === 0)
            return DateUtils.getZeroTime();

        if (speed < 0)
            throw new Error("speed can not be negative");

        let conf = Configuration.globals.pace[Configuration.unit];
        let pace = new Date(DateUtils.getZeroTime().getTime() + ((60 / speed) * 60000));
        return pace;
    }

    public static convertSpeedFromMeterPerSeconds(speed: number) {
        if (speed == null || speed === 0)
            return 0;
        return speed * Configuration.globals.speed[Configuration.unit];
    }

    public static toRadians(num: number): number {
        return num * Math.PI / 180;
    }

    public static toDegrees(num: number): number {
        return num * 180 / Math.PI;
    }

    public static bmiClaculator(highInCm: number, weightInKg: number): number {
        if (highInCm == null || weightInKg == null)
            return null;
        return weightInKg / Math.pow(highInCm / 100, 2);
    }

    public static getBmiClass(bmi: number): BmiClass {
        if (bmi == null)
            return null;
        return Converter.bmiClasses.find((bmic: BmiClass) => {
            return bmic.min <= bmi && bmic.max > bmi;
        });
    }

    public static standardWeigth(highInCm: number): number {
        if (highInCm == null)
            return null;
        return (Math.pow(highInCm / 100, 2) * 2490) / 100;
    }

    public static cloneObject<T>(obj: any): T {
        let objType = typeof obj;
        if (obj == null || typeof obj !== "object") return <T>obj;
        if (objType === "date" || objType === "regexp" || objType === "function" ||
            objType === "string" || objType === "number" || objType === "boolean")
            return Object.create(obj);

        if (objType !== "object" && objType !== "array") return <T>obj;

        let cloneObj = Object.create(obj);

        for (let name in obj) {
            cloneObj[name] = Converter.cloneObject(obj[name]);
        }
        return cloneObj;
    }
}