const assert = require('assert');
const RGB = require('../RGB');

function* entries(obj) {
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

function testColorParsing(color, parts) {
  assert.deepEqual(Array.from(color), parts);

  for (const [i, name] of ['red', 'green', 'blue'].entries()) {
    assert.equal(color[name], parts[i]);
    assert.equal(color[name.charAt(0)], parts[i]);
  }
}

function testColorsParsing(colors) {
  for (const [hash, parts] of entries(colors)) {
    testColorParsing(RGB.parse(hash), parts);
  }
}

function testColorStringifying(color, hash, options) {
  assert.equal(color.toString(options), hash);
}

function testColorsStringifying(colors, options) {
  for (const [hash, parts] of entries(colors)) {
    testColorStringifying(RGB.from(parts), hash, options);
  }
}

function testColorNumerifying(color) {
  assert.equal(Number(color), (color[0] << 16) | (color[1] << 8) | color[2]);
}

function testColorsNumerifying(colors, options) {
  for (const [hash, parts] of entries(colors)) {
    testColorNumerifying(RGB.from(parts), hash, options);
  }
}

describe('colorRgb', () => {
  function test(tests, { prefix, shorten }) {
    const pattern = shorten ? 'rgb' : 'rrggbb';

    it(`can parse ${prefix}${pattern}`, () => {
      testColorsParsing(tests);
    });

    it(`can stringify ${prefix}${pattern}`, () => {
      testColorsStringifying(tests, { prefix, shorten });
    });

    it(`can numerify ${prefix}${pattern}`, () => {
      testColorsNumerifying(tests);
    });
  }

  for (const prefix of ['', '#']) {
    const shortTests = {
      [`${prefix}fff`]: [255, 255, 255],
      [`${prefix}000`]: [0, 0, 0],
      [`${prefix}fa0`]: [255, 170, 0]
    };

    const longTests = {
      [`${prefix}ffffff`]: [255, 255, 255],
      [`${prefix}000000`]: [0, 0, 0],
      [`${prefix}ffaa00`]: [255, 170, 0]
    };

    test(shortTests, { prefix, shorten: true });
    test(longTests, { prefix, shorten: false });
  }
});
