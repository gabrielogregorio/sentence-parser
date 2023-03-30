import { Compare } from './analyzer';

describe('extractors', () => {
  it('should analyze letters', async () => {
    expect(Compare.analyzeLetters('abc', 'abc')).toEqual({ percent: 50, rank: 3 });
    expect(Compare.analyzeLetters('cab', 'abc')).toEqual({ percent: 50, rank: 3 });
    expect(Compare.analyzeLetters('cab', 'abca')).toEqual({ percent: 37.5, rank: 3 });
    expect(Compare.analyzeLetters('cab', 'xabca')).toEqual({ percent: 30, rank: 3 });
    expect(Compare.analyzeLetters('cab', 'skw')).toEqual({ percent: 0, rank: 0 });
  });

  it('should analyze worlds', async () => {
    expect(Compare.analyzeWords('abc', 'abc')).toEqual({ percent: 50, rank: 1 });
    expect(Compare.analyzeWords('abcdk', 'abcdf')).toEqual({ percent: 0, rank: 0 });
    expect(Compare.analyzeWords('abcdk icon', 'icon abcdf')).toEqual({ percent: 25, rank: 1 });
    expect(Compare.analyzeWords('voce esta andando', 'andando esta voce')).toEqual({ percent: 50, rank: 3 });
  });

  it('should return if is synonymous', async () => {
    const compare = new Compare();
    expect(compare.isSynonymous('favorito', 'preferido')).toEqual(true);
    expect(compare.isSynonymous('outro', 'preferido')).toEqual(false);
  });

  it('should compare sentence', async () => {
    const compare = new Compare();
    expect(compare.compareSentences('favorito', 'preferido')).toEqual(100);
    expect(compare.compareSentences('meu doce predileto é abacate', 'meu doce preferido é abacate')).toEqual(100);
    expect(compare.compareSentences('o doce favorito é abacate meu bom', 'meu doce preferido é abacate')).toEqual(
      78.31,
    );
  });

  it('should search ranking', async () => {
    const compare = new Compare();
    expect(compare.searchRanking('favorito', 'preferido')).toEqual(12);
    expect(compare.searchRanking('favorito', 'preferido é meu amigo')).toEqual(12);
    expect(compare.searchRanking('favorito', 'preferido é meu amigo predileto')).toEqual(12);
    expect(compare.searchRanking('favorito e amigo', 'preferido é meu amigo predileto')).toEqual(26);
    expect(compare.searchRanking('favorito e amigo gelo', 'preferido é meu amigo predileto nevex')).toEqual(28);
    expect(compare.searchRanking('favorito e amigo gelo', 'preferido é meu amigo predileto neve')).toEqual(34);
    expect(compare.searchRanking('favorito e amigo gelo meu', 'preferido é meu amigo predileto neve')).toEqual(41);
    expect(compare.searchRanking('item de pesquisa', 'item de pesquisa')).toEqual(26);
    expect(compare.searchRanking('pesquisa item de ', 'item de pesquisa extra item')).toEqual(26);
    expect(compare.searchRanking('pesquisa item de x', 'item de pesquisa extra item')).toEqual(27);
  });
});
