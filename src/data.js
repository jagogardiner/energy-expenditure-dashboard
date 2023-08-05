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
    var tempID;
    // Try/catch to ensure the data file format is valid by checking the first element of the array
    try {
        tempID = data[0].PatientIDnew;
        // Ensure any of the data contains an observation (not just the first element)
        if (data[0].ObsValue == null) {
            throw "Observation value is missing.";
            return;
        }
    } catch (error) {
        alert("Error: Invalid data file format. " + error);
        window.electronAPI.quitApp();
        return;
    }
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
