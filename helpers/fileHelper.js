const fs = require("fs");
const path = require("path");

function createFileAsync(dir, fileName, data) {
  return new Promise((resolve, reject) => {
    fs.open(path.join(dir, fileName), "wx", (openError, fileDescriptor) => {
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
}

function readFileAsync(dir, file) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(dir, file), "utf8", (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
}

function getFilesFromDirectoryAsync(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

module.exports = {
  createFileAsync,
  readFileAsync,
  getFilesFromDirectoryAsync
};
