const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

const partition = (arr, s, e, order) => {
  let pivot = arr[e].fixedPrice;
  let i = s - 1;

  for (let j = s; j <= e - 1; j++) {
    if ((order === "asc" && arr[j].fixedPrice < pivot) || (order === "desc" && arr[j].fixedPrice > pivot)) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, e);
  return i + 1;
};

const quickSort = (arr, s, e, order) => {
  if (s >= e) return;
  let pi = partition(arr, s, e, order);

  quickSort(arr, s, pi - 1, order);
  quickSort(arr, pi + 1, e, order);
};

const bubbleSort = (arr, order) => {
  if (order === "asc" || order === "desc") {
    // Using quicksort for both ascending and descending orders
    const n = arr.length;

    quickSort(arr, 0, n - 1, order);
  }

  return arr;
};

module.exports = bubbleSort;
