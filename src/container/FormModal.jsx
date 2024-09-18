import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from 'antd';
import TextEdit from './widgets/TextEdit';
import DropdownComponent from './widgets/DropdownComponent';
import axios from 'axios';
import * as Yup from 'yup';
import DatePickerComponent from './widgets/DatePickerComponent';
import FormSearchComponent from './widgets/FormSearchComponent';



const getValidationSchema = (elements) => {
    const shape = {};

    elements.forEach((element) => {
        if (element.isRequired) {
            const errorMessage = element.errorMessage || 'This field is required';
            switch (element.inputType) {
                case 'EMAIL':
                    shape[element.ElementID] = Yup.string().email('Invalid email address').required(errorMessage);
                    break;
                case 'NUMBER':
                    shape[element.ElementID] = Yup.number().required(errorMessage);
                    break;
                case 'DECIMAL':
                    shape[element.ElementID] = Yup.number().typeError('Must be a decimal').required(errorMessage);
                    break;
                case 'MOBILE':
                    shape[element.ElementID] = Yup.string()
                        .matches(/^[0-9]{10}$/, 'Must be a valid mobile number')
                        .required(errorMessage);
                    break;
                default:
                    shape[element.ElementID] = Yup.string().required(errorMessage);
            }
            
        } else {
            shape[element.ElementID] = Yup.string();
        }
    });

    return Yup.object().shape(shape);
};

const FoemModal = ({ formData, submitForm }) => {
  const initialValues = formData.elements.reduce((acc, element) => {
    acc[element.ElementID] = element.defaultValue || '';
    return acc;
  }, {});

  const validationSchema = getValidationSchema(formData.elements);

  const renderField = (element) => {
    switch (element.fieldType) {
      case 'TEXT_EDIT':
        return <TextEdit key={element.ElementID} field={element} />;
      case 'DROPDOWN':
        return <DropdownComponent key={element.ElementID} field={element} />;
    case 'DATE_PICKER':
        return <DatePickerComponent key={element.ElementID} field={element} />;
    case 'FORM_SEARCH':
        return <FormSearchComponent key={element.ElementID} field={element} />;
      // Add cases for other field types if needed
      default:
        return null;
    }
  };

  const createForm = async (values, actions) => {
    try {
      const obj = {
        formId: formData.formId,
        id: formData.id,
        values: values
      };
      await axios.post("https://app-data-2.onrender.com/submissions", obj);
      submitForm();
      actions.resetForm(); // Reset the form after submission
    } catch (error) {
      console.log("error =>", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => createForm(values, actions)} // Pass actions to createForm
    >
      {({ resetForm }) => (
        <Form>
          {formData.elements.map((element) => renderField(element))}
          <div className='text-end mt-3'>
            <Button type="primary" htmlType="submit">Submit</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FoemModal;
