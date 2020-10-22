function delay(milliSeconds) {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
}

function createAsyncGenerator(promises) {
  return {
    [Symbol.asyncIterator]: async function*() {
      while (promises.length) {
        yield await promises.shift();
      }
    }
  };
}


module.exports = {
  delay,
  createAsyncGenerator
}