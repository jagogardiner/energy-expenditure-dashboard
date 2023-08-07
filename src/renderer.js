/*
 * Author: Jago Gardiner
 */

var sortedPatients;
var adminPatientData;
var patientToggleView = true;
$('#fader').fadeIn(1000);
$('#loading').css('display', 'flex');
alert("Please open patient data file. This may take a while to load.");
window.electronAPI.readFile().then((data) => {
    // Sort data per patient
    sortedPatients = sortDataPatients(data);
    alert("Please open administered drugs file.");
    window.electronAPI.readFile().then((data) => {
        // Sort admin drugs per patient
        adminPatientData = sortAdminDrugs(sortedPatients, data);
        // Populate patient list option box
        var select = document.getElementById("patientIDList");
        for (var i = 0; i < adminPatientData.length; i++) {
            var opt = adminPatientData[i].PatientIDnew;
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        // Create charts
        createChartAdministration(adminPatientData[0].PatientIDnew);
        createChartPatient(adminPatientData[0].PatientIDnew);
        createChartStatistics(adminPatientData[0].PatientIDnew);
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
        patientToggleView = true;
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
        patientToggleView = false;
        // Reset the select box
        var select = document.getElementById("patientIDList");
        select.selectedIndex = 0;
    });
    $("#statistics-btn").on('click', function () {
        patientToggleView = false;
        $("#patientIDView").fadeOut(500);
        $("#overviewChart").fadeOut(500);
        $("#administrationChart").fadeOut(500);
        $("#statisticsChart").fadeIn(500);
    });
    $("#help-btn").on('click', function () {
        window.electronAPI.openHelp();
    });
});
