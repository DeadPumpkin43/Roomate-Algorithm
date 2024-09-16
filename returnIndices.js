function maxIndices(arr) {
  if (arr.length === 0) {
    return [];
  }

  const maxValue = Math.max(...arr);
  return arr.reduce((indices, value, index) => {
    if (value === maxValue) {
      indices.push(index);
    }
    return indices;
  }, []);
}

export { maxIndices };
