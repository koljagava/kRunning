import {DateUtils} from './Date';
describe('DateUtils.dateParser', () => {

  it('Returns value as it as if it is a string not parsable to date', () => {
    const value = 'pota';
    expect(DateUtils.dateParser(null, value)).toBe(value);
  });

  it('Returns value as it as if it is an object not parsable to date', () => {
    const value = {foo : 1, bar : '2'};
    expect(DateUtils.dateParser(null, value)).toBe(value);
  });

  it('Returns a Date object value if it is a string parsable to date', () => {
    const value = '2010-12-31T23:12:11.100Z';
    const expectedResult = DateUtils.dateParser(null, value);
    expect(typeof expectedResult).toBe('object');
    expect(expectedResult.toString()).toBe(new Date(value).toString());
  });

  it('Returns a Date object value if it is a string parsable to date (2)', () => {
    const value = '2010-12-31T23:12:11.100';
    const expectedResult = DateUtils.dateParser(null, value);
    expect(typeof expectedResult).toBe('object');
    expect(expectedResult.toString()).toBe(new Date(value).toString());
  });
});
