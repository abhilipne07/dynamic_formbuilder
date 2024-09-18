import React from 'react';
import { DatePicker } from 'antd';
import { Field } from 'formik';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;

const DatePickerComponent = ({ field }) => {
    const { hidden, fieldLabel, format, picker, defaultValue, errorMessage } = field;

    if (hidden) {
        return null;
    }

    // Parse defaultValue into a dayjs object if provided
    const parsedDefaultValue = defaultValue ? dayjs(defaultValue, dateFormatList) : null;

    return (
        <Field name={field.ElementID}>
            {({ field: formikField, meta, form }) => (
                <>
                    <DatePicker
                        {...formikField}
                        format={format || dateFormat}
                        picker={picker}
                        value={formikField.value ? dayjs(formikField.value, dateFormatList) : parsedDefaultValue}
                        onChange={(date, dateString) => {
                            form.setFieldValue(field.ElementID, dateString);
                        }}
                        placeholder={fieldLabel}
                    />
                    {meta.touched && meta.error ? (
                        <div style={{ color: 'red' }}>{meta.error || errorMessage}</div>
                    ) : null}
                </>
            )}
        </Field>
    );
};

export default DatePickerComponent;
