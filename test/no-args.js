/* global describe, it, beforeEach */

import Rgb from '../color-rgb'
import assert from 'assert'

function checkAliases (color) {
  for (let [i, key] of Rgb.keys.entries()) {
    assert.equal(color[key], color[i])
    assert.equal(color[key.charAt(0)], color[i])
  }
}

describe('Rgb()', function () {
  let rgb

  beforeEach(function () {
    rgb = new Rgb()
  })

  describe('parts', function () {
    it('should be initialised with 0 for each part', function () {
      assert.equal(rgb[0], 0)
      assert.equal(rgb[1], 0)
      assert.equal(rgb[2], 0)
      assert.equal(rgb.length, 3)
      checkAliases(rgb)
    })

    it('should allow to modify parts', function () {
      const arr = new Array(3).fill(0)

      for (let i = 0; i < 3; ++i) {
        rgb[i] = arr[i] = i + 1
        assert.deepEqual(rgb, arr)
      }
      assert.deepEqual(rgb, [1, 2, 3])
    })

    it('should cut off numbers when to high (like Uint8Array)', function () {
      const arr = new Array(3).fill(0)

      for (let i = 0; i < 3; ++i) {
        arr[i] = i + 1
        rgb[i] = arr[i] + 255 + 1
        assert.deepEqual(rgb, arr)
      }
      assert.deepEqual(rgb, [1, 2, 3])
    })
  })

  describe('#valueOf()', function () {
    it('should be 0 when not modified', function () {
      assert.equal(rgb.valueOf(), '0')
    })

    it('should work when parts are modified', function () {
      let val = 0

      for (let i = 0; i < 3; ++i) {
        rgb[i] = i + 1
        val |= (i + 1) << (2 - i) * 8
        assert.equal(rgb.valueOf(), val)
      }
      assert.equal(rgb.valueOf(), (1 << 16) | (2 << 8) | 3)
    })
  })

  describe('#toString()', function () {
    it('should be #000000 when not modified', function () {
      assert.equal(rgb.toString(), '#000000')
    })

    it('should work when parts are modified', function () {
      let val = 0

      for (let i = 0; i < 3; ++i) {
        rgb[i] = i + 1
        val |= (i + 1) << (2 - i) * 8
        assert.equal(rgb.toString(), `#0${val.toString(16)}`)
      }
      assert.equal(rgb.toString(), `#0${((1 << 16) | (2 << 8) | 3).toString(16)}`)
    })
  })

  describe('#keys()', function () {
    it('should iterate over names', function () {
      for (let i = 0; i < 3; ++i) {
        rgb[i] = i + 10
      }

      let i = 0
      for (let key of rgb.keys()) {
        assert.equal(key, Rgb.keys[i])
        ++i
      }
      assert.equal(i, 3)
    })
  })

  describe('#values()', function () {
    it('should work', function () {
      for (let i = 0; i < 3; ++i) {
        rgb[i] = i + 10
      }

      let i = 0
      for (let val of rgb.values()) {
        assert.equal(val, i + 10)
        ++i
      }
      assert.equal(i, 3)
    })
  })

  describe('#[Symbol.iterator]()', function () {
    it('should work', function () {
      for (let i = 0; i < 3; ++i) {
        rgb[i] = i + 10
      }

      let i = 0
      for (let val of rgb) {
        assert.equal(val, i + 10)
        ++i
      }
      assert.equal(i, 3)
    })
  })

  describe('#entries()', function () {
    it('should work', function () {
      for (let i = 0; i < 3; ++i) {
        rgb[i] = i + 10
      }

      let i = 0
      for (let entry of rgb.entries()) {
        assert.deepEqual(entry, [Rgb.keys[i], i + 10])
        ++i
      }
      assert.equal(i, 3)
    })
  })
})
