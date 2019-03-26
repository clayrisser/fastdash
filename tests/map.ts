import fast from '../src';

describe('map()', () => {
  it('handles an asynchronous iteratee', async () => {
    const result = await fast.map([1, 2, 3], async f => f);
    expect(result).toEqual([1, 2, 3]);
  });

  it('keeps order', async () => {
    const result = await fast.map([9, 8, 7, 6, 5, 4, 3, 2, 1, 0], async f => {
      await new Promise(r => setTimeout(r, f * 100));
      return f;
    });
    expect(result).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it('works with strings', async () => {
    const result = await fast.map('123', f => f);
    expect(result).toEqual(['1', '2', '3']);
  });

  it('works with arrays', async () => {
    const result = await fast.map([1, 2, 3], f => f);
    expect(result).toEqual([1, 2, 3]);
  });

  it('works with objects', async () => {
    const result = await fast.map({ one: 1, two: 2, three: 3 }, f => f);
    expect(result).toEqual([1, 2, 3]);
  });

  it('gracefully handles numbers', async () => {
    const result = await fast.map(1 as any, f => f);
    expect(result).toEqual([]);
  });
});
