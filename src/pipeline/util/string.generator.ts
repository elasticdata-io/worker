export abstract class StringGenerator {
  public static generate(count = 14) {
    const _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';

    for (let i = 0; i < count; i++) {
      str += _sym[parseInt(String(Math.random() * _sym.length))];
    }
    return str;
  }
}
