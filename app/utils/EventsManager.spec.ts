import {EventsManager} from "./EventsManager";
let fakeFunc = () => {return true; };
let fakeEventName = "FakeEvent";

class FakeSubscriber {
    public eventCallCount = 0;

    public functionToCall() {
        this.eventCallCount++;
    };
}

describe("EventsManager", () => {
    it("_channels is not undefined", () => {
        expect(EventsManager._channels).not.toBeUndefined();
    });

    it("_channels is not null", () => {
        expect(EventsManager._channels).not.toBeNull();
    });
});

describe("EventsManager.subscribe", () => {
    it("Register new subscription to a new channel", () => {
        expect(EventsManager._channels[fakeEventName]).toBeUndefined();
        EventsManager.subscribe(fakeEventName, this, fakeFunc);
        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(1);
        expect(EventsManager._channels[fakeEventName][0].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][0].caller).toBe(this);
        EventsManager.unsubscribe(fakeEventName, this);
    });

    it("Does not register same subscrition", () => {
        expect(EventsManager._channels[fakeEventName]).toBeUndefined();
        EventsManager.subscribe(fakeEventName, this, fakeFunc);
        EventsManager.subscribe(fakeEventName, this, fakeFunc);
        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(1);
        expect(EventsManager._channels[fakeEventName][0].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][0].caller).toBe(this);
        EventsManager.unsubscribe(fakeEventName, this);
    });

    it("Register a different subscriptions to a channel", () => {
        expect(EventsManager._channels[fakeEventName]).toBeUndefined();
        EventsManager.subscribe(fakeEventName, this, fakeFunc);
        EventsManager.subscribe(fakeEventName, fakeFunc, fakeFunc);

        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(2);
        expect(EventsManager._channels[fakeEventName][0].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][0].caller).toBe(this);
        expect(EventsManager._channels[fakeEventName][1].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][1].caller).toBe(fakeFunc);

        EventsManager.unsubscribe(fakeEventName, this);
        EventsManager.unsubscribe(fakeEventName, fakeFunc);
    });

});

describe("EventsManager.unsubscribe", () => {
    beforeEach(() => {
        // Initialization
        expect(EventsManager._channels[fakeEventName]).toBeUndefined();
        EventsManager.subscribe(fakeEventName, this, fakeFunc);
    });
    afterEach(() => {
        EventsManager.unsubscribe(fakeEventName, this);
    });

    it("Remove channel if is empty", () => {
        // Test
        EventsManager.unsubscribe(fakeEventName, this);
        // Expect
        expect(EventsManager._channels[fakeEventName]).toBeUndefined();
    });

    it("Unregister a right subscription to a channel", () => {
        // Initialization
        EventsManager.subscribe(fakeEventName, fakeFunc, fakeFunc);
        // Test
        EventsManager.unsubscribe(fakeEventName, fakeFunc);
        // Expect
        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(1);
        expect(EventsManager._channels[fakeEventName][0].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][0].caller).toBe(this);
    });

    it("Does not register same subscrition", () => {
        EventsManager.subscribe(fakeEventName, this, fakeFunc);
        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(1);
        expect(EventsManager._channels[fakeEventName][0].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][0].caller).toBe(this);
    });

    it("Do nothing if no subscription found for eventName", () => {
        let undefEventName = "undefinedEventName";
        expect(EventsManager._channels[undefEventName]).toBeUndefined();
        EventsManager.unsubscribe(undefEventName, this);
        expect(EventsManager._channels[undefEventName]).toBeUndefined();
    });

    it("Do nothing if no subscription found for caller", () => {
        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(1);
        EventsManager.unsubscribe(fakeEventName, fakeFunc);
        expect(EventsManager._channels[fakeEventName]).not.toBeUndefined();
        expect(EventsManager._channels[fakeEventName].length).toBe(1);
        expect(EventsManager._channels[fakeEventName][0].callback).toBe(fakeFunc);
        expect(EventsManager._channels[fakeEventName][0].caller).toBe(this);
    });
});


describe("EventsManager.publish", () => {
    let event1 = "Event1";
    let event2 = "Event2";
    let subscriber1Event1: FakeSubscriber;
    let subscriber2Event1: FakeSubscriber;
    let subscriber1Event2: FakeSubscriber;

    beforeEach(() => {
        subscriber1Event1 = new FakeSubscriber();
        subscriber2Event1 = new FakeSubscriber();
        subscriber1Event2 = new FakeSubscriber();
        expect(EventsManager._channels[event1]).toBeUndefined();
        expect(EventsManager._channels[event2]).toBeUndefined();
        EventsManager.subscribe(event1, subscriber1Event1, subscriber1Event1.functionToCall);
        EventsManager.subscribe(event1, subscriber2Event1, subscriber2Event1.functionToCall);
        EventsManager.subscribe(event2, subscriber1Event2, subscriber1Event2.functionToCall);
    });
    afterEach(() => {
        EventsManager.unsubscribe(event1, subscriber1Event1);
        EventsManager.unsubscribe(event1, subscriber2Event1);
        EventsManager.unsubscribe(event2, subscriber1Event2);
    });

    it("calls all subscribers for the correct event", () => {
        EventsManager.publish(event1);
        expect(subscriber1Event1.eventCallCount).toBe(1);
        expect(subscriber2Event1.eventCallCount).toBe(1);
        expect(subscriber1Event2.eventCallCount).toBe(0);
    });

    it("calls all subscribers for the correct event on multiple publish", () => {
        EventsManager.publish(event1);
        EventsManager.publish(event1);
        expect(subscriber1Event1.eventCallCount).toBe(2);
        expect(subscriber2Event1.eventCallCount).toBe(2);
        expect(subscriber1Event2.eventCallCount).toBe(0);
    });
});