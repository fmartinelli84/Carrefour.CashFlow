import { EnumDisplayNamePipe } from './enum-display-name.pipe';

describe('EnumDisplayNamePipe', () => {
  it('create an instance', () => {
    const pipe = new EnumDisplayNamePipe();
    expect(pipe).toBeTruthy();
  });
});
