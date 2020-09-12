const fs = require("fs");

module.exports = {
  create(dir, fileName, data) {
    return new Promise((resolve, reject) => {
      fs.open(`${dir}/${fileName}.json`, "wx", (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, e => {
                if (!e) {
                  resolve();
                } else {
                  reject(e);
                }
              });
            } else {
              reject(err);
            }
          });
        } else if (error) {
          reject(error);
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
