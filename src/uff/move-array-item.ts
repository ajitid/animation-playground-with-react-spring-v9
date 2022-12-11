// taken from https://github.com/granteagon/move/blob/master/src/index.js
// orginally for fluid-sombrero-list
export function moveArrayItem<T>(array: T[], fromIndex: number, toIndex: number) {
  /* #move - Moves an array item from one position in an array to another.
     Note: This is a pure function so a new array will be returned, instead
     of altering the array argument.
    Arguments:
    1. array      : Array in which to move an item.         (required)
    2. fromIndex  : The index of the item to move.          (required)
    3. toIndex    : The index to move item at moveIndex to. (required)
  */
  const item = array[fromIndex];
  const length = array.length;
  const diff = fromIndex - toIndex;

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, fromIndex),
      ...array.slice(fromIndex + 1, length),
    ];
  } else if (diff < 0) {
    // move right
    const targetIndex = toIndex + 1;
    return [
      ...array.slice(0, fromIndex),
      ...array.slice(fromIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length),
    ];
  }
  return array;
}
