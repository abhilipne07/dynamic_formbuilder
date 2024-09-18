import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Modal, Select, Checkbox, DatePicker, Collapse } from 'antd';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment/moment';


function FormBuilder() {
    const { Panel } = Collapse;
    const navigate = useNavigate();
    const getUniqueRandomStr = (len, prefix = 'EID_') => {
        return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, len)}`;
    };

    const { formId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ elements: [] });
    const [field, setField] = useState({});
    const [optionInput, setOptionInput] = useState("");
    const [allForms, setAllForms] = useState()
    const [formOptions, setFormOptions] =  useState()
    const [allfields, setAllfields] = useState()
    const [dependencies, setDependencies] = useState([]);
    const [currentFormField, setCurrentFormField] = useState()

    const teEditType = [
        {
            value : "EMAIL",
            Label: "Email",
        },
        {
            value: "MOBILE",
            label: "Mobile"
        },
        {
            value: "NUMBER",
            label: "Number"
        },
        {
            value: "DECIMAL",
            label: "Decimal"
        },
        {
            value: "TEXT",
            label: "Text"
        }
    ]

    const addField = async () => {
        console.log("form =>",form) 
        const values = form.elements.map(item => ({
            value: item.ElementID,
            label: item.fieldLabel
        }));  
        setDependencies([])     
        setCurrentFormField(values);

         setField({
            fieldLabel: "Field",
            fieldType: "TEXT_EDIT",
            defaultValue: "",
            options: [],
            isRequired: false,
            hidden: false,
            isChecked: false,
            ElementID: getUniqueRandomStr(5),
            errorMessage: ""
        });
        setShowModal(true);
        
    };

    const addOption = () => {
        if (optionInput.trim()) {
            setField(prevField => ({
                ...prevField,
                options: [...prevField.options, optionInput.trim()]
            }));
            setOptionInput(""); // Clear input after adding
        }
    };
    let dateFormat = "DD/MM/YYYY"
    const options = [
        { value: "TEXT_EDIT", label: "Text Edit" },
        { value: "DROPDOWN", label: "Dropdown" },
        { value: "DATE_PICKER", label: "Date Picker" },
        { value: "FORM_SEARCH", label: "Form Search" }
    ];

    const onSaveField = () => {
        if (field.StateDrop) {

            const stateElementID = getUniqueRandomStr(5);
            const cityElementID = getUniqueRandomStr(5);

            const stateField = {
                ...field,
                fieldLabel: 'State',
                ElementID: stateElementID,
            };
    
            const cityField = {
                ...field,
                fieldLabel: 'City',
                ElementID: cityElementID,
                parentID: stateElementID 

            };
    
            setForm(prevForm => ({
                ...prevForm,
                elements: [
                    ...prevForm.elements,
                    stateField,
                    cityField
                ]
            }));
        } else {
            const updatedField = {
                ...field,
                ...(field.inputType && { inputType: field.inputType }),
                ...(field.StateDrop && { StateDrop: field.StateDrop }),
                ...(field.fieldType === "FORM_SEARCH" && { formSearchConfig: field.formSearchConfig }),
                ...(dependencies.length > 0 && { dependencies })    
            };
            setForm(prevForm => ({
                ...prevForm,
                elements: [...prevForm.elements, updatedField]
            }));
        }
        setShowModal(false);
    };

    const checkForm = async () => {
        try {
            const result = await axios.get(`https://app-data-2.onrender.com/forms?formId=${formId}`);
            if (result.data.length > 0) {
                setForm(result.data[0]);
            } else {
                setForm({
                    formId: formId,
                    formTitle: "Form",
                    elements: []
                });
            }
        } catch (error) {
            console.log("error =>", error);
        }
    };

    useEffect(() => {
        checkForm();
    }, [formId]);


    useEffect(() => {
        const fetchAllForms = async () => {
            try {
                // Fetch all forms
                const res = await axios.get("https://app-data-2.onrender.com/forms");
                setAllForms(res.data);
    
                // Map all forms to options
                const data = res.data.map(item => ({
                    value: item.formId,
                    label: item.formTitle
                }));
                setFormOptions(data);
            } catch (error) {
                console.error("Error fetching forms or form elements:", error);
            }
        };
    
        fetchAllForms();
    }, [formId]);



    const onSaveForm = async () => {
        try {
            // const response = await axios.post('http://localhost:5000/forms', form);
            const formExists = allForms.find(form => form.formId === formId);
            if (!formExists) {
                console.log("form =>",form)
                const response = await axios.post('https://app-data-2.onrender.com/forms', form);
                setForm({
                    formId: "",
                    formTitle: "",
                    elements: []
                });
                setField({
                    fieldLabel: "Field",
                    fieldType: "TEXT_EDIT",
                    defaultValue: "",
                    options: [],
                    isRequired: false,
                    hidden: false,
                    isChecked: false,
                    ElementID: getUniqueRandomStr(5),
                    errorMessage: ""
                });

            } else {
                console.log("form =>", form)
                const result = await axios.patch(`https://app-data-2.onrender.com/forms/${formExists.id}`,form);
            }
            navigate("/");
        } catch (error) {
            console.log("error", error);
        }
    };

    const removeField = (index) => {
        setForm(prevForm => ({
            ...prevForm,
            elements: prevForm.elements.filter((_, i) => i !== index)
        }));
    }

    const handleFieldChange = (key, value) => {
        setField(prevField => ({
            ...prevField,
            [key]: value,
            ...(key === 'selectedForm' && { formSearchConfig: { ...prevField.formSearchConfig, formId: value } }),
            ...(key === 'selectedField' && { formSearchConfig: { ...prevField.formSearchConfig, fieldId: value } }),
        }));
    }; 

    const SelectField = () => {
        const filterElements =  allForms.find(item => item.formId === field.selectedForm)
        console.log("filterElements =>",filterElements)
         const option = filterElements && filterElements.elements.map(item => ({
            value : item.ElementID,
            label : item.fieldLabel
         }))

        setAllfields(option)
    }

    const addDependency = () => {
        setDependencies(prevDeps => [...prevDeps, { formId: null, fieldId: null }]);
    };

    const handleDependencyChange = (index, key, value) => {

        setDependencies((prevDeps) =>
            prevDeps.map((dep, i) => (i === index ? { ...dep, [key]: value } : dep))
        );
    };

    return (
        <div className='container'>
            <div className="row justify-content-center">
                <div className="col-6 mt-5">
                    <div>
                        <label htmlFor="">Form Title</label>
                        <Input placeholder="Add Form Title" value={form.formTitle} onChange={(e) => setForm({ ...form, formTitle: e.target.value })} />
                    </div>
                    <div className='border rounded p-3 mt-5 h-100'>
                        <div className='text-center'>
                            <Button type="primary" onClick={addField}>Add Field</Button>
                        </div>
                        <div className='mt-2 ms-5 me-5'>
                            {form.elements && form.elements.length > 0 && form.elements.map((field, index) => (
                                <div className='mt-2' key={field.ElementID}>
                                    <label htmlFor="label">{field.fieldLabel}</label>
                                    <div className='d-flex align-items-center'>
                                    <Input placeholder={field.fieldType} disabled /> <i onClick={() => removeField(index)} class="bi bi-trash ms-2 " style={{color: "red", cursor:"pointer"}}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='text-end mt-5'>
                            {form.elements.length > 0 && <Button type="primary" className="me-5" onClick={onSaveForm}>Save Form</Button>}
                        </div>
                    </div>

                    <Modal
                        title="Add Field"
                        open={showModal}
                        onOk={onSaveField}
                        onCancel={() => setShowModal(false)}
                        width={700}
                    >
                        <div className="row justify-content-between">
                            <div className="col-6">
                                <label htmlFor="fieldLabel">Field Label</label>
                                <Input placeholder="" value={field.fieldLabel} onChange={(e) => handleFieldChange('fieldLabel', e.target.value)} />
                            </div>
                            <div className="col-4">
                                <label htmlFor="fieldType" className='d-block'>Field Type</label>
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a type"
                                    value={field.fieldType}
                                    onChange={(value) => handleFieldChange('fieldType', value)}
                                    options={options}
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            {field.fieldType === "TEXT_EDIT" && (
                                <div className="col-12">
                                    <label htmlFor="defaultValue">Default Value</label>
                                    <TextArea
                                        placeholder="Set Default Value"
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        value={field.defaultValue}
                                        onChange={(e) => handleFieldChange('defaultValue', e.target.value)}
                                    />
                                     <Select
                                        style={{ width: "100%" }}
                                        className='mt-2'
                                        placeholder="Choose Input Type"
                                        value={field.inputType}
                                        onChange={(value) => handleFieldChange('inputType', value)}
                                        options={teEditType}
                                    />
                                </div>
                            )}
                            {field.fieldType === "DROPDOWN" && (
                                <>
                                    {
                                        !field.StateDrop && (
                                            <>
                                                <div className="col-4">
                                                    <label htmlFor="addOptions">Add Options</label>
                                                    <Input
                                                        placeholder="Option"
                                                        value={optionInput}
                                                        onChange={(e) => setOptionInput(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-4 mt-4">
                                                    <Button type="primary" size="small" onClick={addOption}>Add</Button>
                                                </div>
                                                <div className="col-12">
                                                    <ul>
                                                        {field.options.length > 0 && field.options.map((option, i) => (
                                                            <li key={i}>{option}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </>
                                        )
                                    }
                                    <div>
                                        <Checkbox
                                            checked={field.StateDrop}
                                            onChange={(e) => handleFieldChange('StateDrop', e.target.checked)}
                                        >
                                            City State Deoendancy Dropdown
                                        </Checkbox>
                                    </div>
                                </>
                            )}
                            {
                                field.fieldType === "DATE_PICKER" && (
                                    <div className='row'>
                                        <label htmlFor="addOptions col-12">Default Value</label>
                                        <div className='col-12'>
                                            <DatePicker 
                                                style={{ width: "315px" }}
                                                format={dateFormat}
                                                value={field.defaultValue ? moment(field.defaultValue, dateFormat) : null}
                                                onChange={(date) => handleFieldChange('defaultValue', date ? date.format(dateFormat) : '')}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            {
                                field.fieldType === "FORM_SEARCH" && (
                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="addOptions">Select Form</label>
                                           <div className='col-12'>
                                                <Select
                                                    className='w-50'
                                                    showSearch
                                                    placeholder="Select Form"
                                                    value={field.formSearchConfig?.formId || null}
                                                    onChange={(value) => handleFieldChange('selectedForm', value)}
                                                    options={formOptions}
                                                   
                                                />
                                           </div>
                                        </div>
                                        <div className="col-12 mt-2">
                                            <label htmlFor="addOptions">Select Field</label>
                                            <div className='col-12'>
                                                <Select
                                                    className='w-25'
                                                    showSearch
                                                    placeholder="Select Field"
                                                    onFocus={SelectField}
                                                    onChange={(value) => handleFieldChange('selectedField', value)}
                                                    options={allfields}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 mt-3">
                                        <div>
                                          <Collapse accordion>
                                            <Panel header="Add Dependancy" size="small" key="1">
                                                <Button type="primary" onClick={addDependency}>Add Dependancy</Button>
                                                {dependencies.map((dep, index) => (
                                                    <div key={index} className="row mt-3">
                                                        <div className="col-6">
                                                            <label>depend 1</label>
                                                            <Select
                                                                className='w-100'
                                                                showSearch
                                                                placeholder="Select Form"
                                                                value={dep.formId}
                                                                onChange={(value) => handleDependencyChange(index, 'formId', value)}
                                                                options={allfields}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label>depend 2</label>
                                                            <Select
                                                                className='w-100'
                                                                showSearch
                                                                placeholder="Select Field"
                                                                onFocus={() => SelectField(dep.formId)}
                                                                value={dep.fieldId}
                                                                onChange={(value) => handleDependencyChange(index, 'fieldId', value)}
                                                                options={currentFormField}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </Panel>
                                          </Collapse>
                                        </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="row mt-3">
                                <div className="col-12">
                                    <Checkbox
                                        checked={field.isRequired}
                                        onChange={(e) => handleFieldChange('isRequired', e.target.checked)}
                                    >
                                        Required
                                    </Checkbox>
                                </div>
                                <div className="col-12 mt-2">
                                    <Checkbox
                                        checked={field.hidden}
                                        onChange={(e) => handleFieldChange('hidden', e.target.checked)}
                                    >
                                        Hidden
                                    </Checkbox>
                                </div>
                                <div className="col-12 mt-2">
                                    <Input 
                                    placeholder="Add error message" 
                                    value={field.errorMessage} onChange={(e) => handleFieldChange('errorMessage', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default FormBuilder;
