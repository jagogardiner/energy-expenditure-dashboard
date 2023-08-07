# NHS Energy Expenditure Dashboard

This dashboard is designed to display energy expenditure data from the NHS. It is designed to be used by clinicians to understand the data taken from previous patients to help in the support of new patients.

### To-do

- Implement machine learning view.

## For Administrators/Developers

This program attempts to load data from these CSV files which contain the following headers.
They are not all essential, but please ensure your file follows the same format. For more information please see:

- `src/data.js` where the files are processed
- `src/graphing.js` where the graphs display the processed data

Observation data:

- PatientIDnew
- DoB
- Age
- Gender
- Dept
- UnitFromTime
- UnitToTime
- eCaMISDischargeDate
- Abbreviation
- ObsValue
- MarkedInError
- UnitName
- ObsTime
- ObsValidationTime

Drug administration data:

- PatientIDnew
- DoB
- Age
- Gender
- Dept
- UnitFromTime
- UnitToTime
- eCaMISDischargeDate
- DoseFormName
- RouteName
- OrderID1
- StartTime
- DrugName
- AdministeredDose
- ActualDose
- BatchNumberValue
- Frequency
- TemplateName

Observation data example:
![ExcelImage1](/src/img/help-data/help-1.png)
Drug administration data example:
![ExcelImage2](/src/img/help-data/help-2.png)

## Graph parameters

In `src/graphing.js`, the chart.js parameters use the individual patient data by the selected patient on the select element.

The tooltips can be modified with new data supplied in `src/data.js` - for example, adding a new header into the CSV file can be added to the patient object when the data is processed:

```js
path: src/data.js
line: 67

var PatientTemp = {
    PatientIDnew: data[x].PatientIDnew,
    ...
    UnitToTime: data[x].UnitToTime,
    eCaMISDischargeDate: data[x].eCaMISDischargeDate,
    Observations: [],
    AdminDrugs: []
    newData: data[x].newData // from CSV file
}
```

And then used in the graph:

```js
path: src/graphing.js
line: 42
tooltip:
{
    callbacks: {
        ...
        // Create the tooltip after label
        afterLabel: function (tooltipItem) {
            // Create an array to hold all the data for the selected point
            var tooltipLabelArray = [];
            tooltipLabelArray.push(patient.Observations.find(x => x.ObsTime == obsTime && x.Abbreviation == "Set PEEP (or CPAP)"));
            ...
            tooltipLabelArray.push(patient.newData);
            ...
            return tooltipText;
        }
        ...
    }
},
```

Or added to the datasets in either observations or drug administration, by adding it to either array:

```js
path: src/graphing.js
line: 116

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
    ...
    {
        label: 'newDataLabel',
        data: patient.Observations.map((x) => x.newData == "example" ? x.ObsValue : null),
    },
    ]
}
```
