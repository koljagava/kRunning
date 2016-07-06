export class StringUtils {
    public static format(str: string, ...args: Array<any>): string {
        return str.replace(/{(\d+)}/g, (match: string, num: number) => {
            return typeof args[num] != 'undefined'
                ? args[num]
                : match;
        });
    }
} 