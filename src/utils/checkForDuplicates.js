const checkForDuplicates = (oldArray, newArray) => {
  newArray = newArray.filter((game) => !oldArray.includes(game));
  newArray = [...oldArray, ...newArray];

  return newArray;
};

module.exports = { checkForDuplicates };
