var sortedPatients;
var adminPaitentData;
var patientChart;
var adminChart;
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
        (async function () {
            handleChart(adminPaitentData[0].PatientIDnew);
        })();
        $('#loading').css('display', 'none');
        $('#fader').fadeOut(1000);
        $(function () {
            $("#home-btn").on('click', function () {
                $("#administrationChart").fadeOut(500);
                $("#overviewChart").fadeIn(500);
            });
            $("#activity-btn").on('click', function () {
                $("#overviewChart").fadeOut(500);
                $("#administrationChart").fadeIn(500);
            });
        });
    });
});

function filterSelect(val) {
    // When the box is changed then remove all the options from the select and add back in only the ones that match the filter.
    var select = document.getElementById("patientIDList");
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
    for (var i = 0; i < adminPaitentData.length; i++) {
        if (adminPaitentData[i].PatientIDnew.includes(val)) {
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
        var tempID = paitent.PatientIDnew;
        data.forEach(element => {
            if (tempID == element.PatientIDnew) {
                var adminTemp = {
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
                paitent.AdminDrugs.push(adminTemp);
            }
        });
    });
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
                if (tempID == element.PatientIDnew) {
                    delete element.PatientIDnew;
                    delete element.PatientIDnew;
                    delete element.DoB;
                    delete element.Age;
                    delete element.Gender;
                    delete element.Dept;
                    delete element.UnitFromTime;
                    delete element.UnitToTime;
                    delete element.eCaMISDischargeDate;
                    PaitentTemp.Observations.push(element);
                } else {
                    newDataArray.push(PaitentTemp);
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
                    tempID = element.PatientIDnew;
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
    return newDataArray;
}

function createChartPatient(patientID) {
    var patient = adminPaitentData.find(x => x.PatientIDnew == patientID);
    if (patient == null) {
        alert("Patient not found");
        return;
    }
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
                    },
                    stepSize: 20,
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
                        var unitName = patient.Observations[tooltipItem.dataIndex].UnitName;
                        var obsVal = patient.Observations[tooltipItem.dataIndex].ObsValue;
                        // Append unit name to the tooltip
                        return tooltipItem.dataset.label + ": " + obsVal + " " + unitName;
                    },
                    afterLabel: function (tooltipItem) {
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
        patientChart.destroy();
    }
    const ctx = document.getElementById('overviewChart').getContext('2d');
    patientChart = new Chart(ctx, chartData);
}

function createChartAdministration(patientID) {
    var patient = adminPaitentData.find(x => x.PatientIDnew == patientID);
    if (patient == null) {
        alert("Patient not found");
        return;
    }
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
                    },
                    stepSize: 20,
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
                        var unitName = patient.Observations[tooltipItem.dataIndex].UnitName;
                        var obsVal = patient.Observations[tooltipItem.dataIndex].ObsValue;
                        // Append unit name to the tooltip
                        return tooltipItem.dataset.label + ": " + obsVal + " " + unitName;
                    },
                    afterLabel: function (tooltipItem) {
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
            labels: patient.AdminDrugs.map((x) => x.StartTime),
            datasets: [{
                label: 'HR',
                data: patient.AdminDrugs.map((x) => x.Abbreviation == "*HR" ? x.ObsValue : null),
            },
            ]
        }
    }
    if (adminChart) {
        adminChart.destroy();
    }
    const ctx = document.getElementById('administrationChart').getContext('2d');
    adminChart = new Chart(ctx, chartData);
}

function handleChart(patientID) {
    createChartPatient(patientID);
    createChartAdministration(patientID);
}
