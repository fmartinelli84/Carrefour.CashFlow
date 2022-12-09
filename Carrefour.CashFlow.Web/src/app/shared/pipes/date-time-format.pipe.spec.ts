import { DateTimeFormatPipe } from './date-time-format.pipe';

describe('DateTimeFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new DateTimeFormatPipe(null);
    expect(pipe).toBeTruthy();
  });
});
