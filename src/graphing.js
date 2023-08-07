/*
 * Created Date: Saturday, August 5th 2023, 5:17:31 pm
 * Author: Jago Gardiner
 */

var patientChart;
var adminChart;
var statisticsChart;

function createChartPatient(patientID) {
    // Find the patient in the array
    var patient = adminPatientData.find(x => x.PatientIDnew == patientID);
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
    var patient = adminPatientData.find(x => x.PatientIDnew == patientID);
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
                text: 'Drugs administration | ' + patientID,
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
    // Create the chart with ctx
    const ctx = document.getElementById('administrationChart').getContext('2d');
    adminChart = new Chart(ctx, chartData);
}

function createChartStatistics() {
    // Chart for overall patient statistics like no. of drugs administered, no. of observations taken etc.
    // Don't focus on a single patient, instead show the overall statistics for all patients on a bar chart.
    // Get all the patients in the array
    var patients = adminPatientData;
    // Create the chart options
    var options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                type: 'time',
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Patient statistics',
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
        type: 'bar',
        options: options,
        data: {
            // Create the labels for the chart - distribution of patient records in the data
            // Labels should be the top 50 patients with the most records in the data and ignore empty records
            // Sort from highest to lowest
            labels: patients.map((x) => x.PatientIDnew),
            datasets: [
                {
                    // No. of observations taken > 0
                    label: 'No. of observations',
                    data: patients.map((x) => x.Observations.length ? x.Observations.length : null),
                },
                {
                    label: 'No. of drugs administered',
                    data: patients.map((x) => x.AdminDrugs.length ? x.AdminDrugs.length : null),
                },
            ]
        }
    }
    if (statisticsChart) {
        // If the chart already exists then destroy it
        statisticsChart.destroy();
    }
    // Create the chart with ctx
    const ctx = document.getElementById('statisticsChart').getContext('2d');
    statisticsChart = new Chart(ctx, chartData);
}

function handleChart(patientID) {
    // Get currently focused chart and create the one needed, then destroy the old one.
    if (patientToggleView) {
        createChartPatient(patientID);
    } else if (!patientToggleView && $("#administrationChart").is(":hidden")) {
        createChartStatistics(patientID);
    } else {
        createChartAdministration(patientID);
    }
}
