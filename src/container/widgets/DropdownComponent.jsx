import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { Field, useFormikContext } from 'formik';
import { City, State } from 'country-state-city';

const { Option } = Select;

const DropdownComponent = ({ field, StateDrop, hidden }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const { values } = useFormikContext();

  useEffect(() => {
    if (field.StateDrop) {
      if (field.fieldLabel === 'State') {
        const fetchedStates = State.getStatesOfCountry('IN');
        setStates(fetchedStates);
      }
    }
  }, [StateDrop, field.fieldLabel]);

  let id = field.parentID

  const onFocus = () => {
    let parentValue = values[id];
    const selectedStates = State.getStatesOfCountry('IN').find((state) => state.name == parentValue);
    
    if (selectedStates.isoCode) {
      const fetchedCities = City.getCitiesOfState('IN', selectedStates.isoCode);

      setCities(fetchedCities);
    }
  }

  const handleStateChange = (value) => {
    setSelectedState(value);
  };

  if (hidden) {
    return null;
  }

  return (
    <Field name={field.ElementID}>
      {({ field: formikField }) => (
        <>
          {field.StateDrop ? (
            <>
                {field.fieldLabel && (
                  <label htmlFor={field.ElementID} className='mt-2' style={{ display: 'block', marginBottom: '0.5em' }}>
                      {field.fieldLabel}
                  </label>
                  )}
                {field.fieldLabel === 'State' ? (
                
                // State Dropdown
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  {...formikField}
                  placeholder="Select State"
                  value={formikField.value || field.defaultValue}
                  onChange={(value) => {
                    formikField.onChange({ target: { name: field.ElementID, value } });
                    handleStateChange(value); // Update selected state
                  }}
                >
                  {states.map((state) => (
                    <Option key={state.isoCode} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
              ) : field.fieldLabel === 'City' ? (
                // City Dropdown
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  {...formikField}
                  placeholder="Select City"
                  onFocus={onFocus}
                  value={formikField.value || field.defaultValue}
                  onChange={(value) => formikField.onChange({ target: { name: field.ElementID, value } })}
                  disabled={selectedState}
                >
                  {cities.map((city) => (
                    <Option key={city.geonameId} value={city.name}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              ) : null}
            </>
          ) : (
            // Single Dropdown
            <Select
              style={{ width: '100%' }}
              {...formikField}
              placeholder={field.fieldLabel}
              defaultValue={formikField.value || field.defaultValue}
              onChange={(value) => formikField.onChange({ target: { name: field.ElementID, value } })}
            >
              {field.options.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          )}
        </>
      )}
    </Field>
  );
};

export default DropdownComponent;
