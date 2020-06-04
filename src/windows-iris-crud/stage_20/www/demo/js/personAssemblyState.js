let personAssemblyState = {
  name: 'person',
  title: 'Person Class/Document Editor',
  summary: {
    title: 'Current Person Records',
    titleColour: 'primary',
    btnIcon: 'user-plus',
    btnColour: 'success',
    btnTooltip: 'Add a New Person',
    qewd: {
      getSummary: 'personsSummary',
    }
  },
  detail: {
    cardWidth: '500px',
    newRecordTitle: 'Enter New Person',
    titleColour: 'primary',
    fields: [
      {
        name: 'name',
        data_property: 'name',
        label: 'Name',
        type: 'text',
        labelWidth: 4
      },
      {
        name: 'gender',
        data_property: 'gender',
        label: 'Gender',
        type: 'select',
        labelWidth: 4,
        options: [
          {text: 'Select...', value: 'invalid'},
          {text: 'Male', value: 'm'},
          {text: 'Female', value: 'f'},
          {text: 'Not Specified', value: 'x'}
        ]
      },
      {
        name: 'city',
        data_property: 'city',
        label: 'City',
        type: 'text',
        labelWidth: 4
      }
    ]
  },
  update: {
    btnText: 'Save Person',
    btnColour: 'success',
    qewd: {
      save: 'updatePerson'
    }
  }
};

export {personAssemblyState};
