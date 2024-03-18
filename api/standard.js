const fs = require('fs');

exports.write = function (res, path, type) {
    try {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.writeHead(200, { 'Content-Type': type });
                res.write(data);
                return res.end();
            }
        });
    } catch (error) {
        console.log(error)
    }
}

exports.error = function (res, content) {
    try {
        fs.readFile("html/error.html", "utf-8", (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.writeHead(200, { 'Content-Type': ('text/html') });
                res.write(data + content + '</body></html>');
                return res.end();
            }
        });
    } catch (error) {
        console.log(error)
    }
}