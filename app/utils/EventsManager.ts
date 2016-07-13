class FunctionStore {
    callback: Function;
    caller: Object;
    constructor(callback: Function, caller: Object) {
        this.callback = callback;
        this.caller = caller;
    }
}

export class EventsManager {
    public static _channels = new Array<Array<FunctionStore>>();

    public static subscribe(topic: string, caller: Object, callback: Function): boolean {
        let channel = EventsManager._channels[topic];
        if (!channel) {
            channel = new Array<FunctionStore>();
            EventsManager._channels[topic] = channel;
        }
        if (EventsManager.getFunctionStoreByCaller(channel, caller) == null) {
            channel.push(new FunctionStore(callback, caller));
            return true;
        }
        return false;
    }

    private static getFunctionStoreByCaller(channel: Array<FunctionStore>, caller: Object): FunctionStore {
        let fs = channel.find((fs: FunctionStore) => { return fs.caller === caller; });
        return fs;
    }

    public static unsubscribe(topic: string, caller: Object): boolean {
        let channel = EventsManager._channels[topic];
        if (!channel)
            return false;

         if (caller == null) {
             delete EventsManager._channels[topic];
             return true;
         }

        let fs = EventsManager.getFunctionStoreByCaller(channel, caller);

        if (fs == null) {
            // Wasn't found, wasn't removed
            return false;
        }

        channel.splice(channel.indexOf(fs), 1);

        // If the channel is empty now, remove it from the channel map
        if (!channel.length) {
            delete EventsManager._channels[topic];
        }
        return true;
    }

    public static publish(topic: string, ... params: Array<any>): boolean {
        let channel = EventsManager._channels[topic];
        if (!channel)
            return false;

        channel.forEach((fs: FunctionStore) => {
            fs.callback.bind(fs.caller)(params);
        });
        return true;
    }
}