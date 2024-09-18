// CheckboxComponent.js
import React from 'react';
import { Field } from 'formik';
import { Checkbox } from 'antd';

const CheckboxComponent = ({ element }) => {
  return (
    <div className="form-group">
      <Field name={element.ElementID}>
        {({ field, form }) => (
          <Checkbox
            className='mt-2'
            id={element.ElementID}
            checked={field.value}
            onChange={e => form.setFieldValue(field.name, e.target.checked)}
            disabled={element.hidden} // Optional: disable if hidden
          >
            {element.fieldLabel}
          </Checkbox>
        )}
      </Field>
    </div>
  );
};

export default CheckboxComponent;
