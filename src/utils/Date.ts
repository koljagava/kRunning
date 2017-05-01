export class DateUtils {
    public static reISO: RegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    public static timeOptions: any = { timeZone: 'UTC', timeZoneName: 'short' };
    public static getZeroTime(): Date {
        let time = new Date(0);
        time.setTime(time.getTimezoneOffset() * 60000);
        return time;
    }

    public static getTimeToSting(data: Date): string {
        return data.toLocaleTimeString(DateUtils.timeOptions);
    }

    public static dateParser(key: any, value: any): any {
        if (typeof value === 'string') {
            let chk = DateUtils.reISO.exec(value);
            if (chk)
                return new Date(value);
        }
        return value;
    }
} 