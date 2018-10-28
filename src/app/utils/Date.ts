export class DateUtils {
    public static reISO: RegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

    public static dateParser(key: any, value: any): any {
        if (typeof value === 'string') {
            const chk = DateUtils.reISO.exec(value);
            if (chk) {
                return new Date(value);
            }
        }
        return value;
    }
}
