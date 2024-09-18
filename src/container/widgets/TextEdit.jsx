import React from 'react';
import { Input } from 'antd';
import { Field, useField, useFormikContext } from 'formik';

const TextEdit = ({ field }) => {
    const { inputType, hidden, errorMessage, fieldLabel, ElementID } = field;
    const [formikField, meta, helpers] = useField(ElementID);

    // Determine input type dynamically
    const type = {
        EMAIL: 'email',
        NUMBER: 'number',
        DECIMAL: 'text',
        MOBILE: 'tel',
        // Add more types as needed
    }[inputType] || 'text';

    if (hidden) {
        return null;
    }

    const handleChange = (e) => {
        const newValue = inputType === 'MOBILE' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value;
        helpers.setValue(newValue);
    };

    return (
        <>
            {fieldLabel && (
                <label htmlFor={ElementID} className='mt-2' style={{ display: 'block', marginBottom: '0.5em' }}>
                    {fieldLabel}
                </label>
            )}
            <Input
                id={ElementID}
                type={type}
                placeholder={fieldLabel}
                value={formikField.value || ''}
                onChange={handleChange}
            />
            {meta.touched && meta.error ? (
                <div style={{ color: 'red' }}>{meta.error || errorMessage}</div>
            ) : null}
        </>
    );
};

export default TextEdit;
