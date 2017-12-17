import { RGB } from './RGB';

export { RGB };

export function parse(val) {
  return RGB.parse(val);
}

export default function(val) {
  if (typeof val === 'string') {
    return parse(val);
  }

  return RGB.from(val);
}
