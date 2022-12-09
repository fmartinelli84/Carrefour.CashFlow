import { TimeFormatPipe } from './time-format.pipe';

describe('TimeFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeFormatPipe(null);
    expect(pipe).toBeTruthy();
  });
});
