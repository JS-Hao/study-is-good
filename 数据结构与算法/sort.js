/**
 * 冒泡排序，从小到大
 * @param {*} arr
 */
function bubbleSort(arr) {
  const len = arr.length;

  for (let i = 0; i < len; i++) {
    let isExchange = false;
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        isExchange = true;
      }
    }
    if (!isExchange) {
      return arr;
    }
  }

  return arr;
}

/**
 * 插入排序
 * @param {*} arr
 */
function insertSort(arr) {
  const len = arr.length;

  if (len <= 1) {
    return arr;
  }

  for (let i = 1; i < len; i++) {
    const val = arr[i];
    let j;

    for (j = i - 1; j >= 0; j--) {
      if (arr[j] > val) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }

    arr[j + 1] = val;
  }

  return arr;
}

/**
 * 选择排序
 */
function selectSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = arr[i],
      pos = i;
    for (let j = i; j < len; j++) {
      if (arr[j] < min) {
        min = arr[j];
        pos = j;
      }
    }
    const temp = arr[i];
    arr[i] = arr[pos];
    arr[pos] = temp;
  }

  return arr;
}

/**
 * 归并排序
 */
function mergeSort(arr) {
  if (arr.length <= 0) {
    return arr;
  }

  function spliceForMergeSort(arr, start, end) {
    const middle = Math.floor((start + end) / 2);

    if (middle === end) {
      return [arr[middle]];
    }

    return mergeForMergeSort(
      spliceForMergeSort(arr, start, middle),
      spliceForMergeSort(arr, middle + 1, end)
    );
  }

  function mergeForMergeSort(arr1, arr2) {
    const result = [];
    const len1 = arr1.length;
    const len2 = arr2.length;
    let p1 = 0;
    let p2 = 0;

    while (p1 < len1 && p2 < len2) {
      if (arr1[p1] <= arr2[p2]) {
        result.push(arr1[p1]);
        p1++;
      } else {
        result.push(arr2[p2]);
        p2++;
      }
    }

    const [rArr, rp] = p1 === len1 ? [arr2, p2] : [arr1, p1];

    for (let i = rp; i < rArr.length; i++) {
      result.push(rArr[i]);
    }
    return result;
  }

  return spliceForMergeSort(arr, 0, arr.length - 1);
}

/**
 * 快速排序
 */
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  function _quickSort(arr, start, end) {
    if (start >= end) {
      return;
    }

    const val = arr[end];
    let p = start;
    for (let i = start; i < end; i++) {
      if (arr[i] <= val) {
        const temp = arr[p];
        arr[p] = arr[i];
        arr[i] = temp;
        p++;
      }
    }

    const temp = arr[p];
    arr[p] = val;
    arr[end] = temp;

    _quickSort(arr, start, p - 1);
    _quickSort(arr, p + 1, end);
  }

  _quickSort(arr, 0, arr.length - 1);

  return arr;
}
