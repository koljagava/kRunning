import {Converter} from './Converter';
import {DateUtils} from './Date';
import {Configuration} from '../Configuration';

class FakeObject {
  public p3;
  constructor(public p1, public p2) {}
  public f1() {
    return 'Func1';
  }
  public f2() {
    return 'Func1';
  }
}

describe('Converter.getPaceFromSpeed', () => {

  it('Returns zero Time if speed is null', () => {
    expect(Converter.getPaceFromSpeed(null).toString()).toBe(DateUtils.getZeroTime().toString());
  });

  it('Return zero Time if speed is undefined', () => {
    // tslint:disable-next-line:prefer-const
    let undef;
    expect(Converter.getPaceFromSpeed(undef).toString()).toBe(DateUtils.getZeroTime().toString());
  });

  it('Returns zero Time if speed is zero', () => {
    expect(Converter.getPaceFromSpeed(0).toString()).toBe(DateUtils.getZeroTime().toString());
  });

  it('Returns correct Pace', () => {
    const expectedPace = DateUtils.getZeroTime();
    expectedPace.setHours(0, 2, 24);
    expect(Converter.getPaceFromSpeed(25).toString()).toBe(expectedPace.toString());
  });

//   it("Throws error if speed is Negative", () => {
//     expect(Converter.getPaceFromSpeed(0)).toThrowError(Error, "speed can not be negative");
//   });
});

describe('Converter.convertSpeedFromMeterPerSeconds', () => {

  it('Returns zero if speed is null', () => {
    expect(Converter.convertSpeedFromMeterPerSeconds(null)).toBe(0);
  });

  it('Return zero if speed is undefined', () => {
    // tslint:disable-next-line:prefer-const
    let a;
    expect(Converter.convertSpeedFromMeterPerSeconds(a)).toBe(0);
  });

  it('Returns zero if speed is zero', () => {
    expect(Converter.convertSpeedFromMeterPerSeconds(0)).toBe(0);
  });

  it('Returns correct Pace in Miles', () => {
    const expectedSpeed = 22.369;
    const prevUnit = Configuration.unit;
    Configuration.unit = Configuration.globals.units.miles;
    expect(Converter.convertSpeedFromMeterPerSeconds(10)).toBe(expectedSpeed);
    Configuration.unit = prevUnit;
  });

  it('Returns correct Pace in Kilometers', () => {
    const expectedSpeed = 36;
    const prevUnit = Configuration.unit;
    Configuration.unit = Configuration.globals.units.kms;
    expect(Converter.convertSpeedFromMeterPerSeconds(10)).toBe(expectedSpeed);
    Configuration.unit = prevUnit;
  });
});

describe('Converter.cloneObjec', () => {
  it('Returns null if object to clone is null', () => {
    expect(Converter.cloneObject(null)).toBeNull();
  });

  it('Return undefined if object to clone is undefined', () => {
    // tslint:disable-next-line:prefer-const
    let a;
    expect(Converter.cloneObject(a)).toBeUndefined();
  });

  it('Returns number if object to clone is a number', () => {
    const test = 1;
    const result = Converter.cloneObject(test);
    expect(typeof result).toBe('number');
    expect(result).toBe(1);
  });

  it('Returns string if object to clone is a string', () => {
    const test = 'this is a string';
    const result = Converter.cloneObject(test);
    expect(typeof result).toBe('string');
    expect(result).toBe('this is a string');
  });

  it('Returns boolean if object to clone is a boolean', () => {
    const test = true;
    const result = Converter.cloneObject(test);
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('Returns Date if object to clone is a Date', () => {
    const test: Date = new Date();
    const result = Converter.cloneObject<Date>(test);
    expect(result instanceof Date).toBe(true);
    expect(result).not.toBe(test);
    expect(result.getTime()).toBe(test.getTime());
  });

  it('Returns array if object to clone is a array', () => {
    const test: Array<any> = [1, '2', null];
    const result = Converter.cloneObject(test);
    expect(result instanceof Array).toBe(true);
    // expect(result).toBe('this is a string');
  });

  it('Returns FakeObject if object to clone is a FakeObject', () => {
    const test = new FakeObject(1, 2);
    test.p3 = {a: 1, b: 'pota'};
    const result = Converter.cloneObject<FakeObject>(test);
    // expect(result instanceof FakeObject).toBe(true);
    expect(result).not.toBe(test);
    expect(result.p1).toBe(test.p1);
    expect(result.p2).toBe(test.p2);
    expect(result.p3.a).toBe(test.p3.a);
    expect(result.p3.b).toBe(test.p3.b);
    test.p1 = 111;
    test.p3.a = 333;
    expect(result.p1).not.toBe(test.p1);
    expect(result.p3.a).not.toBe(test.p3.a);
  });
});
