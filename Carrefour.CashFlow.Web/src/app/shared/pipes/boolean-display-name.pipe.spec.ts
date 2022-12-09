import { BooleanDisplayNamePipe } from './boolean-display-name.pipe';

describe('BooleanDisplayNamePipe', () => {
  it('create an instance', () => {
    const pipe = new BooleanDisplayNamePipe();
    expect(pipe).toBeTruthy();
  });
});
