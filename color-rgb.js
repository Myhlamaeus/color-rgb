import ArrayLikeObjectWrapper from "array-like-object-wrapper";

function pad(str, len, pos = "start", chr = "0") {
    str = String(str);
    len = Number(len);
    pos = String(pos);
    chr = String(chr);

    if(pos !== "start" && pos !== "end") {
        throw new Error("pad: pos is neither 'start' nor 'end'");
    }

    if(Number.isNaN(len)) {
        throw new TypeError("pad: length is not a number");
    }
    if(str.length < len) {
        let padStr = new Array(len - str.length + 1).join(chr);

        if(pos === "start") {
            str = padStr + str;
        } else {
            str += padStr;
        }
    }
    return str;
}

class Rgb extends ArrayLikeObjectWrapper {
    constructor(iterable) {
        let arr = new Uint8Array(3);
        {
            const spec = {};

            for(let [i, name] of Rgb.keys.entries()) {
                spec[name] = spec[name.charAt(0)] = {
                    get: function() {
                        return arr[i];
                    },
                    set: function(val) {
                        arr[i] = val;
                    },
                    configurable: true
                };
            }
            Object.defineProperties(this, spec);
        }

        if(iterable) {
            let i = 0;

            for(let val of iterable) {
                if(i >= this.length) {
                    throw new RangeError("Rgb: iterable is too long");
                }
                arr[i++] = val >>> 0;
            }
        }

        super(arr);
    }

    valueOf() {
        return Array.prototype.map.call(this, function(val, i) {
            return val << (2 - i) * 8;
        }).reduce(function(sum, val) {
            return sum | val;
        }, 0);
    }

    toString() {
        return "#" + pad(this.valueOf().toString(16), 6);
    }

    * keys() {
        for(let key of Rgb.keys) {
            yield key;
        }
    }

    [Symbol.toStringTag]() {
        return `Rgb([${Array.prototype.join.call(this, ", ")}]) = ${this.toString()}`;
    }
}

Rgb.keys = Object.freeze(["red", "green", "blue"]);

Rgb.parse = function(str) {
    str = String(str);

    if(str.charAt(0) === "#") {
        str = str.slice(1);
    }
    if(!/^(?:[0-9a-f]{3}){1,2}$/i.test(str)) {
        throw new Error("Rgb.parse: invalid string");
    }
    let vals = [],
        spacing = str.length / 3;
    for(let i = 0; i < str.length; i += spacing) {
        vals.push(parseInt(str.slice(i, i + spacing), 16));
    }
    return new this(vals);
};

Rgb.from = function(arrLikeOrIterable) {
    return new this(Array.from(arrLikeOrIterable));
};

export default Rgb;
