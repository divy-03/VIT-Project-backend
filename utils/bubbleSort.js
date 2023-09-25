const bubbleSort = (arr, order) => {
  if (order === "asc") {
    // Ascending order logic (unchanged)
    const len = arr.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 0; i < len - 1; i++) {
        if (arr[i].fixedPrice > arr[i + 1].fixedPrice) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
  } else if (order === "desc") {
    // Descending order logic
    const len = arr.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 0; i < len - 1; i++) {
        if (arr[i].fixedPrice < arr[i + 1].fixedPrice) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
  }

  return arr;
};

module.exports = bubbleSort;
