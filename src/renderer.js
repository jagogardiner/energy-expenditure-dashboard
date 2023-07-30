var sortedPatients;
var adminPaitentData;
var patientChart;
var adminChart;
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
        // Hide loading screen
        $('#loading').css('display', 'none');
        $('#fader').fadeOut(1000);
    });
});

$(function () {
    // Logic for the sidebar buttons.
    $("#home-btn").on('click', function () {
        // Fade out the current chart and fade in the new one
        $("#administrationChart").fadeOut(500);
        $("#overviewChart").fadeIn(500);
        // Set the toggle view to true
        paitentToggleView = true;
        // Reset the select box
        var select = document.getElementById("patientIDList");
        select.selectedIndex = 0;
    }
    );
    $("#activity-btn").on('click', function () {
        // Fade out the current chart and fade in the new one
        $("#overviewChart").fadeOut(500);
        $("#administrationChart").fadeIn(500);
        // Set the toggle view to false
        paitentToggleView = false;
        // Reset the select box
        var select = document.getElementById("patientIDList");
        select.selectedIndex = 0;
    });
});

function filterSelect(val) {
    // When the box is changed then remove all the options from the select and add back in only the ones that match the filter.
    var select = document.getElementById("patientIDList");
    // Remove all options from the select
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
    // Add the default option back in
    for (var i = 0; i < adminPaitentData.length; i++) {
        // Check if the ID contains the filter
        if (adminPaitentData[i].PatientIDnew.includes(val)) {
            // Add the option to the select
            var opt = adminPaitentData[i].PatientIDnew;
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }
}

function sortAdminDrugs(paitentData, data) {
    // Find all admin drugs for this paitent
    paitentData.forEach(paitent => {
        // Create a temp array to hold the data
        var tempID = paitent.PatientIDnew;
        // Loop through all the data
        data.forEach(element => {
            // Check if the ID is the same as the last one
            if (tempID == element.PatientIDnew) {
                var adminTemp = {
                    // Add the data to the temp array
                    DoseFormName: element.DoseFormName,
                    RouteName: element.RouteName,
                    OrderID1: element.OrderID1,
                    StartTime: element.StartTime,
                    StartTimeTimeOnly: element.StartTimeTimeOnly,
                    StartTimeDateOnly: element.StartTimeDateOnly,
                    DatePartMonth: element.DatePartMonth,
                    DrugName: element.DrugName,
                    AdministeredDose: element.AdministeredDose,
                    ActualDose: element.ActualDose,
                    Frequency: element.Frequency,
                    TemplateName: element.TemplateName,
                }
                // Add the temp array to the paitent array
                paitent.AdminDrugs.push(adminTemp);
            }
        });
    });
    // Return the paitent data
    return paitentData;
}

function sortDataPaitents(data) {
    var newDataArray = [];
    var PaitentTemp = {
        PatientIDnew: data[0].PatientIDnew,
        DoB: data[0].DoB,
        Age: data[0].Age,
        Gender: data[0].Gender,
        Dept: data[0].Dept,
        UnitFromTime: data[0].UnitFromTime,
        UnitToTime: data[0].UnitToTime,
        eCaMISDischargeDate: data[0].eCaMISDischargeDate,
        Observations: [],
        AdminDrugs: []
    }
    var tempID = data[0].PatientIDnew;
    data.forEach(element => {
        // Check that the ID is not already in the array
        if (newDataArray.find(x => x.PatientIDnew == element.PatientIDnew)) {
            // skip this element
        } else
            if (element.ObsValue == "") {
                // skip this element
            } else {
                // Check if the ID is the same as the last one
                if (tempID == element.PatientIDnew) {
                    // Add the observation to the array, delete the unneeded data
                    delete element.PatientIDnew;
                    delete element.PatientIDnew;
                    delete element.DoB;
                    delete element.Age;
                    delete element.Gender;
                    delete element.Dept;
                    delete element.UnitFromTime;
                    delete element.UnitToTime;
                    delete element.eCaMISDischargeDate;
                    // Add the observation to the array
                    PaitentTemp.Observations.push(element);
                } else {
                    // Add the patient to the array, delete the unneeded data
                    newDataArray.push(PaitentTemp);
                    // Create a new patient
                    PaitentTemp = {
                        PatientIDnew: element.PatientIDnew,
                        DoB: element.DoB,
                        Age: element.Age,
                        Gender: element.Gender,
                        Dept: element.Dept,
                        UnitFromTime: element.UnitFromTime,
                        UnitToTime: element.UnitToTime,
                        eCaMISDischargeDate: element.eCaMISDischargeDate,
                        Observations: [],
                        AdminDrugs: []
                    }
                    // Set the new ID
                    tempID = element.PatientIDnew;
                    // Add the observation to the array, delete the unneeded data
                    delete element.PatientIDnew;
                    delete element.DoB;
                    delete element.Age;
                    delete element.Gender;
                    delete element.Dept;
                    delete element.UnitFromTime;
                    delete element.UnitToTime;
                    delete element.eCaMISDischargeDate;
                    PaitentTemp.Observations.push(element);
                }
            }
    });
    // Add the last patient to the array
    return newDataArray;
}

function createChartPatient(patientID) {
    // Find the patient in the array
    var patient = adminPaitentData.find(x => x.PatientIDnew == patientID);
    if (patient == null) {
        alert("Patient not found");
        return;
    }
    // Create the chart options
    var options = {
        spanGaps: true,
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        // Set the y axis min to 0 and set the step size to 20
        scales: {
            y: {
                min: 0,
                ticks: {
                    font: {
                        size: 10
                    },
                    stepSize: 20,
                }
            },
            x: {
                type: 'time',
            },
        },
        // Create the tooltip
        plugins: {
            legend: {
                position: 'top',
                // Don't show legend items if all data is null
                labels: {
                    filter: (legendItem, chartData) => (!chartData.datasets[legendItem.datasetIndex].data.every(item => item === null))
                },
            },
            tooltip:
            {
                callbacks: {
                    // Create the tooltip label
                    label: function (tooltipItem) {
                        // Callback to get the unit name and obs value
                        var unitName = patient.Observations[tooltipItem.dataIndex].UnitName;
                        var obsVal = patient.Observations[tooltipItem.dataIndex].ObsValue;
                        // Append unit name to the tooltip
                        return tooltipItem.dataset.label + ": " + obsVal + " " + unitName;
                    },
                    // Create the tooltip after label
                    afterLabel: function (tooltipItem) {
                        // Create an array to hold all the data for the selected point
                        var tooltipLabelArray = [];
                        var obsTime = patient.Observations[tooltipItem.dataIndex].ObsTime;
                        // Find the all data in observations for the selected point
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Axilla Temperature"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Environment Temp."));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Mattress  Temp"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "SkinTemp (Core)"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Position"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Temp. (Overhead)"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Ventilation / Support"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Ventilation Mode"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Set PEEP"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Set PEEP (or CPAP)"));
                        tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Pinsp (set PIP)"));
                        // Create the tooltip text, if data is null then don't show it
                        var tooltipText = "";
                        tooltipLabelArray.forEach(element => {
                            if (element != null) {
                                tooltipText += element.Abbreviation + ": " + element.ObsValue + "\n";
                            }
                        }
                        );
                        return tooltipText;
                    }
                }
            },
            title: {
                display: true,
                text: 'Patient ID: ' + patientID,
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                limits: {
                    x: {
                        min: 'original',
                        max: 'original',
                    },
                    y: {
                        min: 'original',
                        max: 'original',
                    },
                }
            },
        }
    }
    var chartData = {
        type: 'line',
        options: options,
        data: {
            labels: patient.Observations.map((x) => x.ObsTime),
            datasets: [{
                label: 'HR',
                data: patient.Observations.map((x) => x.Abbreviation == "*HR" ? x.ObsValue : null),
            },
            {
                label: 'RR',
                data: patient.Observations.map((x) => x.Abbreviation == "*RR" ? x.ObsValue : null),
            },
            {
                label: 'SpO2',
                data: patient.Observations.map((x) => x.Abbreviation == "SpO2" ? x.ObsValue : null),
            },
            {
                label: 'FiO2',
                data: patient.Observations.map((x) => x.Abbreviation == "*FiO2" ? x.ObsValue : null),
            },
            {
                label: 'NIBPdias',
                data: patient.Observations.map((x) => x.Abbreviation == "*NIBPdias" ? x.ObsValue : null),
            },
            {
                label: 'NIBPmean',
                data: patient.Observations.map((x) => x.Abbreviation == "NIBPmean" ? x.ObsValue : null),
            },
            {
                label: 'NIBPsys',
                data: patient.Observations.map((x) => x.Abbreviation == "*NIBPsys" ? x.ObsValue : null),
            },
            {
                label: 'Vent Measured RR',
                data: patient.Observations.map((x) => x.Abbreviation == "Vent Measured RR" ? x.ObsValue : null),
            }
            ]
        }
    }
    if (patientChart) {
        // If the chart already exists then destroy it
        patientChart.destroy();
    }
    // Create the chart with ctx
    const ctx = document.getElementById('overviewChart').getContext('2d');
    patientChart = new Chart(ctx, chartData);
}

function createChartAdministration(patientID) {
    // Find the patient in the array
    var patient = adminPaitentData.find(x => x.PatientIDnew == patientID);
    // Check that the patient exists
    if (patient == null) {
        alert("Patient not found");
        return;
    }
    // Create the chart options
    var options = {
        spanGaps: true,
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        scales: {
            y: {
                min: 0,
                ticks: {
                    font: {
                        size: 10
                    }
                }
            },
            x: {
                type: 'time',
            },
        },
        plugins: {
            legend: {
                position: 'top',
                // Don't show legend items if all data is null
                labels: {
                    filter: (legendItem, chartData) => (!chartData.datasets[legendItem.datasetIndex].data.every(item => item === null))
                },
            },
            tooltip:
            {
                callbacks: {
                    label: function (tooltipItem) {
                        // Return the template name
                        var TemplateName = patient.Observations[tooltipItem.dataIndex].TemplateName;
                        return TemplateName;
                    },
                    afterLabel: function (tooltipItem) {
                        var tooltipLabelArray = [];
                        var startTime = patient.Observations[tooltipItem.dataIndex].StartTime;
                        // Find the all data in observations for the selected point
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Adrenaline"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Dexamethasone"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Dopamine"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Esomeprazole"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Fentanyl"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Furosemide"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Hydrocortisone"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Midazolam"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Morphine"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Milrinone"));
                        tooltipLabelArray.push(patient.AdminDrugs.find(x => x.StartTime == startTime && x.DrugName == "Noradrenaline"));
                        // Create the tooltip text, if data is null then don't show it
                        var tooltipText = "";
                        tooltipLabelArray.forEach(element => {
                            if (element != null) {
                                tooltipText += element.DrugName + ": " + element.AdministeredDose + "\n";
                            }
                        }
                        );
                        return tooltipText;
                    }
                }
            },
            title: {
                display: true,
                text: 'Patient ID: ' + patientID,
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                limits: {
                    x: {
                        min: 'original',
                        max: 'original',
                    },
                    y: {
                        min: 'original',
                        max: 'original',
                    },
                }
            },
        }
    }
    // Create the chart data
    var chartData = {
        // Create the chart type
        type: 'line',
        options: options,
        data: {
            // Create the labels for the chart
            labels: patient.AdminDrugs.map((x) => x.StartTime),
            datasets: [{
                label: 'Adrenaline',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Adrenaline" ? x.ActualDose : null),
            },
            {
                label: 'Dexamethasone',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Dexamethasone" ? x.ActualDose : null),
            },
            {
                label: 'Dopamine',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Dopamine" ? x.ActualDose : null),
            },
            {
                label: 'Esomeprazole',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Esomeprazole" ? x.ActualDose : null),
            },
            {
                label: 'Fentanyl',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Fentanyl" ? x.ActualDose : null),
            },
            {
                label: 'Furosemide',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Furosemide" ? x.ActualDose : null),
            },
            {
                label: 'Hydrocortisone',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Hydrocortisone" ? x.ActualDose : null),
            },
            {
                label: 'Midazolam',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Midazolam" ? x.ActualDose : null),
            },
            {
                label: 'Morphine',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Morphine" ? x.ActualDose : null),
            },
            {
                label: 'Milrinone',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Milrinone" ? x.ActualDose : null),
            },
            {
                label: 'Noradrenaline',
                data: patient.AdminDrugs.map((x) => x.DrugName == "Noradrenaline" ? x.ActualDose : null),
            }
            ]
        }
    }

    if (adminChart) {
        // If the chart already exists then destroy it
        adminChart.destroy();
    }
    console.log(chartData.data.datasets)
    // Create the chart with ctx
    const ctx = document.getElementById('administrationChart').getContext('2d');
    adminChart = new Chart(ctx, chartData);
}

function handleChart(patientID) {
    // Get currently focused chart and create the one needed, then destroy the old one.
    if (paitentToggleView) {
        createChartPatient(patientID);
    } else {
        createChartAdministration(patientID);
    }
}
