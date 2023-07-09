var sortedPatients;
var adminPaitentData;
alert("Please open Paitent Data file.");
window.electronAPI.readFile().then((data) => {
    // Sort data per patient
    sortedPatients = sortDataPaitents(data);
    alert("Please open Admin Drugs file.");
    window.electronAPI.readFile().then((data) => {
        // Sort admin drugs per patient
        adminPaitentData = sortAdminDrugs(sortedPatients, data);
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

(async function () {
    window.electronAPI.createChart(
        {
            type: 'line',
            data: {
                labels: ["DoB", "Age", "Gender", "Dept", "UnitFromTime", "UnitToTime", "eCaMISDischargeDate", "Abbreviation", "ObsValue", "MarkedInError", "UnitName", "ObsTime", "ObsValidationTime"],
                datasets: [{
                    label: 'Patient 2019-2020',
                    data: retdata,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                }]
            }
        }, "overviewChart"
    );
})();
