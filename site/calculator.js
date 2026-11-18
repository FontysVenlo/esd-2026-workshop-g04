// export function add(first, second) {
//   return first + second;
// }


///Now let’s deliberately introduce a bug. In site/calculator.js, change + to -:

export function add(first, second) {
  return first - second;
}