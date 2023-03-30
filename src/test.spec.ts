import { Compare } from './analyzer';

describe('extractors', () => {
  it('should analyze letters', async () => {
    expect(Compare.analyzeLetters('abc', 'abc')).toEqual(50);
    expect(Compare.analyzeLetters('cab', 'abc')).toEqual(50);
    expect(Compare.analyzeLetters('cab', 'abca')).toEqual(37.5);
    expect(Compare.analyzeLetters('cab', 'xabca')).toEqual(30);
    expect(Compare.analyzeLetters('cab', 'skw')).toEqual(0);
  });

  it('should analyze worlds', async () => {
    expect(Compare.analyzeWords('abc', 'abc')).toEqual(50);
    expect(Compare.analyzeWords('abcdk', 'abcdf')).toEqual(0);
    expect(Compare.analyzeWords('abcdk icon', 'icon abcdf')).toEqual(25);
    expect(Compare.analyzeWords('voce esta andando', 'andando esta voce')).toEqual(50);
  });

  it('should return if is synonymous', async () => {
    const compare = new Compare();
    expect(compare.isSynonymous('favorito', 'preferido')).toEqual(true);
    expect(compare.isSynonymous('outro', 'preferido')).toEqual(false);
  });

  it('should return if is synonymous', async () => {
    const compare = new Compare();
    expect(compare.compareSentences('favorito', 'preferido')).toEqual(100);
    expect(compare.compareSentences('meu doce predileto é abacate', 'meu doce preferido é abacate')).toEqual(100);
    expect(compare.compareSentences('o doce favorito é abacate meu bom', 'meu doce preferido é abacate')).toEqual(
      78.31,
    );
  });
});
