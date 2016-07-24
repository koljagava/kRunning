import {Converter} from "./Converter";
import {DateUtils} from "./Date";
import {Configuration} from "../Configuration";

describe("Converter.getPaceFromSpeed", () => {

  it("Returns zero Time if speed is null", () => {
    expect(Converter.getPaceFromSpeed(null).toString()).toBe(DateUtils.getZeroTime().toString());
  });

  it("Return zero Time if speed is undefined", () => {
    let undef;
    expect(Converter.getPaceFromSpeed(undef).toString()).toBe(DateUtils.getZeroTime().toString());
  });

  it("Returns zero Time if speed is zero", () => {
    expect(Converter.getPaceFromSpeed(0).toString()).toBe(DateUtils.getZeroTime().toString());
  });

  it("Returns correct Pace", () => {
    let expectedPace = DateUtils.getZeroTime();
    expectedPace.setHours(0, 2, 24);
    expect(Converter.getPaceFromSpeed(25).toString()).toBe(expectedPace.toString());
  });

//   it("Throws error if speed is Negative", () => {
//     expect(Converter.getPaceFromSpeed(0)).toThrowError(Error, "speed can not be negative");
//   });
});

describe("Converter.convertSpeedFromMeterPerSeconds", () => {

  it("Returns zero if speed is null", () => {
    expect(Converter.convertSpeedFromMeterPerSeconds(null)).toBe(0);
  });

  it("Return zero if speed is undefined", () => {
    let a;
    expect(Converter.convertSpeedFromMeterPerSeconds(a)).toBe(0);
  });

  it("Returns zero if speed is zero", () => {
    expect(Converter.convertSpeedFromMeterPerSeconds(0)).toBe(0);
  });

  it("Returns correct Pace in Miles", () => {
    let expectedSpeed = 22.369;
    let prevUnit = Configuration.unit;
    Configuration.unit = Configuration.globals.units.miles;
    expect(Converter.convertSpeedFromMeterPerSeconds(10)).toBe(expectedSpeed);
    Configuration.unit = prevUnit;
  });

  it("Returns correct Pace in Kilometers", () => {
    let expectedSpeed = 36;
    let prevUnit = Configuration.unit;
    Configuration.unit = Configuration.globals.units.kms;
    expect(Converter.convertSpeedFromMeterPerSeconds(10)).toBe(expectedSpeed);
    Configuration.unit = prevUnit;
  });
});