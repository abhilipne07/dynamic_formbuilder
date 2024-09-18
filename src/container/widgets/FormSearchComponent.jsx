import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import { Field, useFormikContext } from 'formik';

const { Option } = Select;

const FormSearchComponent = ({ field }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { values } = useFormikContext();
    const { formSearchConfig, fieldLabel, ElementID } = field;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`https://app-data-2.onrender.com/submissions?formId=${formSearchConfig.formId}`)
                const filteredData = response.data
                    .filter(item => item.formId === formSearchConfig.formId && item.values[formSearchConfig.fieldId])
                    .map(item => ({
                        value: item.values[formSearchConfig.fieldId],
                        label: item.values[formSearchConfig.fieldId]
                    }));
                    const uniqueData = removeDuplicates(filteredData);
                    console.log("uniqueData =>",uniqueData)
                    setOptions(uniqueData)
                    setLoading(false);
            } catch (error) {
                console.error('Error fetching options:', error);
                setLoading(false);
            }
        };

        if (formSearchConfig) {
            fetchOptions();
        }
    }, [field]);

    const removeDuplicates = (array) => {
        const seen = new Set();
        return array.reduce((acc, item) => {
            if (!seen.has(item.value)) {
                seen.add(item.value);
                acc.push(item);
            }
            return acc;
        }, []);
    };

    const onFocus = async () => {
        console.log("formSearchConfig =>",formSearchConfig)
        if (Object.keys(field).includes('dependencies') && field.dependencies.length > 0) {
            try {
                const submission = await axios.get(`https://app-data-2.onrender.com/submissions?formId=${formSearchConfig.formId}`);
                const valueOnly = submission.data.map(item => item.values);
                const value = values[field.dependencies[0].fieldId];
                const id = field.dependencies[0].formId;
                const filteredData = valueOnly.filter(item => item[id] === value);
                const filterdep = formSearchConfig.fieldId ? formSearchConfig.fieldId : null;
                const uniqueValues = [...new Set(filteredData.map(item => item[filterdep]).filter(value => value !== undefined))];
                const formattedValues = uniqueValues.map(value => ({
                    value: value,
                    label: value
                }));
                setOptions(formattedValues);
            } catch (error) {
                console.error('Error fetching options on focus:', error);
            }
        }

    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Field name={field.ElementID}>
            {({ field: formikField, meta }) => (
                <> 
                    {fieldLabel && (
                        <label htmlFor={ElementID} className='mt-2' style={{ display: 'block', marginBottom: '0.5em' }}>
                            {fieldLabel}
                        </label>
                        )}
                    <Select
                        className="w-100"
                        {...formikField}
                        onChange={(value) => formikField.onChange({ target: { name: field.ElementID, value } })}
                        onFocus={onFocus}
                    >
                        {options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                    {meta.touched && meta.error ? (
                        <div style={{ color: 'red' }}>{meta.error}</div>
                    ) : null}
                </>
            )}
        </Field>
    );
};

export default FormSearchComponent;
