const fs = require("fs");

module.exports = {
  create(dir, fileName, data) {
    return new Promise((resolve, reject) => {
      fs.open(`${dir}/${fileName}.json`, "wx", (openError, fileDescriptor) => {
        if (!openError && fileDescriptor) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, writeError => {
            if (!writeError) {
              fs.close(fileDescriptor, closeError => {
                if (!closeError) {
                  resolve();
                } else {
                  reject(closeError);
                }
              });
            } else {
              reject(writeError);
            }
          });
        } else if (openError) {
          reject(openError);
        }
      });
    });
  },
  read(dir, file) {
    return new Promise((resolve, reject) => {
      fs.readFile(`${dir}/${file}.json`, "utf8", (error, data) => {
        if (error) reject(error);
        resolve(data);
      });
    });
  }
};

function defaultErrorHandler(error, resolve, reject) {
  if (!error) {
    resolve()
  } else {
    reject(error)
  }
}
