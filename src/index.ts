import { Compare } from 'src/analyzer';

const compare = new Compare();

console.log(compare.compareSentences('meu doce preferido é abacaxi', 'meu doce favorito e abacaxi'));
console.log(compare.compareSentences('meu doce preferido é abacaxi', 'meu doce favorito e abacaxi'));

console.log(compare.searchRanking('meu doce preferido é abacaxi', 'meu doce favorito e abacaxi'));
console.log(compare.searchRanking('predileto', 'meu doce favorito e abacaxi'));
