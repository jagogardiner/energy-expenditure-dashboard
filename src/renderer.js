var sortedPatients;
var adminPaitentData;
var patientChart;
var adminChart;
var statisticsChart;
var paitentToggleView = true;
$('#fader').fadeIn(1000);
$('#loading').css('display', 'flex');
alert("Please open paitent data file. This may take a while to load.");
window.electronAPI.readFile().then((data) => {
    // Sort data per patient
    sortedPatients = sortDataPaitents(data);
    alert("Please open administered drugs file.");
    window.electronAPI.readFile().then((data) => {
        // Sort admin drugs per patient
        adminPaitentData = sortAdminDrugs(sortedPatients, data);
        // Populate paitent list option box
        var select = document.getElementById("patientIDList");
        for (var i = 0; i < adminPaitentData.length; i++) {
            var opt = adminPaitentData[i].PatientIDnew;
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        // Create charts
        createChartAdministration(adminPaitentData[0].PatientIDnew);
        createChartPatient(adminPaitentData[0].PatientIDnew);
        createChartStatistics(adminPaitentData[0].PatientIDnew);
        // Hide loading screen
        $('#loading').css('display', 'none');
        $('#fader').fadeOut(1000);
        $("#administrationChart").hide();
        $("#statisticsChart").hide();
    });
});

$(function () {
    // Logic for the sidebar buttons.
    $("#home-btn").on('click', function () {
        $("#patientIDView").fadeIn(500);
        // Fade out the current chart and fade in the new one
        $("#administrationChart").fadeOut(500);
        $("#statisticsChart").fadeOut(500);
        $("#overviewChart").fadeIn(500);
        // Set the toggle view to true
        paitentToggleView = true;
        // Reset the select box
        var select = document.getElementById("patientIDList");
        select.selectedIndex = 0;
    }
    );
    $("#activity-btn").on('click', function () {
        $("#patientIDView").fadeIn(500);
        // Fade out the current chart and fade in the new one
        $("#overviewChart").fadeOut(500);
        $("#statisticsChart").fadeOut(500);
        $("#administrationChart").fadeIn(500);
        // Set the toggle view to false
        paitentToggleView = false;
        // Reset the select box
        var select = document.getElementById("patientIDList");
        select.selectedIndex = 0;
    });
    $("#statistics-btn").on('click', function () {
        paitentToggleView = false;
        $("#patientIDView").fadeOut(500);
        $("#overviewChart").fadeOut(500);
        $("#administrationChart").fadeOut(500);
        $("#statisticsChart").fadeIn(500);
    });
});
