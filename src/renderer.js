function init() {
    // Load dialog to select CSV file
    // File path is returned as a promise
    window.electronAPI.readFile().then((data) => {
        console.log(data)
    })
}

init();
