function init() {
    // Load dialog to select CSV file
    var file = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { extensions: ['csv'] }
        ]
    });
}

init();
