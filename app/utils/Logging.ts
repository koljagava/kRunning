import {Configuration} from "../Configuration";
import {LocalStorage} from "./Storage";

class DataLog{
    date : Date;
    caller : string;
    message: string;
    stack : string;

    constructor(caller : Object, err : any){
        this.date = new Date();
        this.caller = this.getClassName(caller);
        this.message = err.message||null;
        this.stack = err.stack||null;
    }

    private getClassName(obj : Object) : string {
        var funcNameRegex = /function (.{1,})\(/;
        var results  = (funcNameRegex).exec(obj["constructor"].toString());
        return (results && results.length > 1) ? results[1] : "unknown";
    }
}

export class Logging{
    private static dataLogs : Array<DataLog> = LocalStorage.getObject<Array<DataLog>>("debug_dataLogs")||new Array<DataLog>(); 
    
    public static log(caller: Object, error : Error|string){

        if (Configuration.debugEnabled!==true)
            return;
        let err: Error;
        if (error instanceof Error)
            err = error; 
        else
            err = new Error(<string>error);
        Logging.dataLogs.push(new DataLog(caller, err));
        LocalStorage.setObject("debug_dataLogs", Logging.dataLogs);
    }
}
