function readDataFile() {
    data = window.electronAPI.readFile().then((data) => {
        return data;
    });
}

var paitent20192020 = readDataFile();
var admin20192020 = readDataFile();
