import {Logging} from './Logging';

class FakeClass {
    constructor() {
        Logging.log(this, 'test');
    }
}
