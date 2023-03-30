import { classes } from './classes';

const HALF = 50;

const normalizeUtf8 = (value: string): string =>
  value
    ?.toLowerCase()
    .replace(/\s{1,}/g, ' ')
    .trim()
    .replace(/\//g, ' ')
    .replace(/-/g, ' ')
    .replace(/\)/g, ' ')
    .replace(/\(/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]{1,}/g, '')
    .trim();

export const fixNumber = (item: number): number => Number(item?.toFixed(2));

export class Compare {
  private worlds: Record<string, string> = {};

  private classes: Record<string, string[]> = {};

  constructor() {
    Object.entries(classes).forEach(([_, words], index) => {
      this.classes[index.toString()] = words.map((word) => normalizeUtf8(word));

      words.forEach((world) => {
        this.worlds[normalizeUtf8(world)] = index.toString();
      });
    });
  }

  public isSynonymous(word1: string, word2: string): boolean {
    const word1Normalized = normalizeUtf8(word1);
    const world2Normalized = normalizeUtf8(word2);

    const worldClass = this.worlds[word1Normalized];

    return Boolean(worldClass) && this.classes[worldClass].includes(world2Normalized);
  }

  private normalizeSentences(inputNormalized: string, targetNormalized: string): [string, string] {
    const inputWorlds = inputNormalized.split(' ');
    const targetWords = targetNormalized.split(' ');

    for (let i = 0; i < inputWorlds.length; i++) {
      const inputWorldSentence = inputWorlds[i];
      for (let j = 0; j < targetWords.length; j++) {
        const targetWorldSentence = targetWords[j];
        if (this.isSynonymous(inputWorldSentence, targetWorldSentence)) {
          targetWords[j] = inputWorldSentence;
        }
      }
    }

    return [targetWords.join(' ').trim(), inputWorlds.join(' ').trim()];
  }

  public static analyzeLetters(inputNormalized: string, targetNormalized: string): { percent: number; rank: number } {
    const inputLetters = inputNormalized.replaceAll(/\s/g, '').split('');
    const targetLetters = targetNormalized.replaceAll(/\s/g, '').split('');

    const sizeTarget = targetLetters.length;

    let countRank = 0;
    inputLetters.forEach((letter) => {
      const indexOfTarget = targetLetters.indexOf(letter);
      if (indexOfTarget >= 0) {
        countRank += 1;
        targetLetters.splice(indexOfTarget, 1);
      }
    });

    try {
      return { percent: (HALF / sizeTarget) * (sizeTarget - targetLetters.length), rank: countRank };
    } catch (error: unknown) {
      console.error('error on letters process', error);
      return { percent: 0, rank: 0 };
    }
  }

  public static analyzeWords(inputNormalized: string, targetNormalized: string): { percent: number; rank: number } {
    const inputWords = inputNormalized.split(' ');
    const targetWords = targetNormalized.split(' ');

    const sizeTarget = targetWords.length;
    let countRank = 0;
    inputWords.forEach((world) => {
      const indexOfTarget = targetWords.indexOf(world);
      if (indexOfTarget >= 0) {
        countRank += 1;
        targetWords.splice(indexOfTarget, 1);
      }
    });

    try {
      return { percent: (HALF / sizeTarget) * (sizeTarget - targetWords.length), rank: countRank };
    } catch (error: unknown) {
      console.error('error on worlds process', error);
      return { percent: 0, rank: 0 };
    }
  }

  compareSentences(inputUser: string, targetUser: string): number {
    let input = normalizeUtf8(inputUser);
    let target = normalizeUtf8(targetUser);

    if (!input || !target) {
      return 0;
    }

    [input, target] = this.normalizeSentences(input, target);

    return fixNumber(Compare.analyzeLetters(input, target).percent + Compare.analyzeWords(input, target).percent);
  }

  searchRanking(inputUser: string, targetUser: string): number {
    let input = normalizeUtf8(inputUser);
    let target = normalizeUtf8(targetUser);

    if (!input || !target) {
      return 0;
    }

    [input, target] = this.normalizeSentences(input, target);

    return fixNumber(Compare.analyzeLetters(input, target).rank + Compare.analyzeWords(input, target).rank * 8);
  }
}
