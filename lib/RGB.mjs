import leftPad from 'left-pad';
import { setExpectedLength } from 'fixed-length-arrays/lib/factory';
import FixedLengthUint8ClampedArray from 'fixed-length-arrays/lib/FixedLengthUint8ClampedArray';

export default class RGB extends FixedLengthUint8ClampedArray {
  toString({ shorten = true, prefix = '#' } = {}) {
    if (!prefix) {
      prefix = '';
    }

    let string = leftPad(Number(this).toString(16), 6, '0');

    if (shorten) {
      const match = string.match(/([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/i);

      if (match !== null) {
        string = match.slice(1).join('');
      }
    }

    return prefix + string;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.reduce((sum, val) => (sum << 8) | val, 0);
    }

    return this.toString();
  }
}

setExpectedLength(RGB, 3);

Object.defineProperties(RGB, {
  parse: {
    value(str) {
      str = String(str);

      if (str.charAt(0) === '#') {
        str = str.slice(1);
      }
      if (!/^(?:[0-9a-f]{3}){1,2}$/i.test(str)) {
        throw new Error(`Invalid string`);
      }

      const vals = [];
      const spacing = str.length / 3;
      for (let i = 0; i < str.length; i += spacing) {
        vals.push(parseInt(str.slice(i, i + spacing).repeat(2 / spacing), 16));
      }

      return new this(vals);
    },
    writable: true,
    configurable: true
  }
});

{
  const specs = {};

  for (const [key, name] of ['red', 'green', 'blue'].entries()) {
    const spec = {
      get() {
        return this[key];
      },
      set(val) {
        this[key] = val;
      },
      enumerable: true,
      configurable: true
    };

    specs[name] = spec;
    specs[name.charAt(0)] = specs[name];
  }

  Object.defineProperties(RGB.prototype, specs);
}
