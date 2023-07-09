var sortedPatients;
var adminPaitentData;
alert("Please open Paitent Data file. Please wait! This may take a while to load.");
window.electronAPI.readFile().then((data) => {
    // Sort data per patient
    sortedPatients = sortDataPaitents(data);
    alert("Please open Admin Drugs file.");
    window.electronAPI.readFile().then((data) => {
        // Sort admin drugs per patient
        adminPaitentData = sortAdminDrugs(sortedPatients, data);
        // Create charts
        (async function () {
            createChartPatient(1097);
        })();
    });
});
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
    var options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                ticks: {
                    font: {
                        size: 10
                    },
                    stepSize: 10,
                }
            },
        },
        plugins: {
            legend: {
                position: 'right',
                maxWidth: 400,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: () => " label",
                },
            },
        },
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
                label: 'Temp. (Overhead)',
                data: patient.Observations.map((x) => x.Abbreviation == "Temp. (Overhead)" ? x.ObsValue : null),
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
                label: 'Axillary Temp',
                data: patient.Observations.map((x) => x.Abbreviation == "Axillary Temp" ? x.ObsValue : null),
            },
            {
                label: 'Environment Temp',
                data: patient.Observations.map((x) => x.Abbreviation == "Environment Temp" ? x.ObsValue : null),
            },
            {
                label: 'Mattress Temp',
                data: patient.Observations.map((x) => x.Abbreviation == "Mattress Temp" ? x.ObsValue : null),
            },
            {
                label: 'Pinsp (set PIP)',
                data: patient.Observations.map((x) => x.Abbreviation == "Pinsp (set PIP)" ? x.ObsValue : null),
            },
            {
                label: 'Position',
                data: patient.Observations.map((x) => x.Abbreviation == "Position" ? x.ObsValue : null),
            },
            {
                label: 'Set PEEP',
                data: patient.Observations.map((x) => x.Abbreviation == "Set PEEP" ? x.ObsValue : null),
            },
            {
                label: 'Set PEEP or CPAP',
                data: patient.Observations.map((x) => x.Abbreviation == "Set PEEP or CPAP" ? x.ObsValue : null),
            },
            {
                label: 'Skin Temp',
                data: patient.Observations.map((x) => x.Abbreviation == "Skin Temp" ? x.ObsValue : null),
            },
            {
                label: 'Vent Measured RR',
                data: patient.Observations.map((x) => x.Abbreviation == "Vent Measured RR" ? x.ObsValue : null),
            },
            {
                label: 'Ventilation/Support',
                data: patient.Observations.map((x) => x.Abbreviation == "Ventilation/Support" ? x.ObsValue : null),
            },
            {
                label: 'Ventilation/Mode',
                data: patient.Observations.map((x) => x.Abbreviation == "Ventilation/Mode" ? x.ObsValue : null),
            },
            ]
        }
    }
    window.electronAPI.createChart(chartData, "overviewChart")
}
