import { Button, Modal, Table } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import FormModal from '../container/FormModal';

function SeeForm() {
    const { formId } = useParams()
    const [columns, setColumns] = useState()
    const [submissions, setSubmissions] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form, setForm] = useState(null)

    const getSingleForm = async () => {
        try {
            const response = await axios.get(`https://app-data-2.onrender.com/forms?formId=${formId}`);
            setForm(response.data[0])
            const transformedElements = response.data[0].elements.length > 0 && response.data[0].elements.map(element => ({
                title: element.fieldLabel,
                dataIndex: element.ElementID,
                key: element.ElementID
            }));
            setColumns(transformedElements)
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    }

    const addEntry = () => {
        setIsModalVisible(true)
    }

    const submitForm = () => {
        setIsModalVisible(false)
        getAllSubmissions()
    }

    const getAllSubmissions = async () => {
        try {
            const submission = await axios.get(`https://app-data-2.onrender.com/submissions?formId=${formId}`)
            const result = submission.data.map(item => item.values);
            setSubmissions(result)

        } catch (error) {
            console.log("error =>", error)
        }

    }

     useEffect(() => {
        getSingleForm()
        getAllSubmissions()
     },[])
     
  return (
    <div className='m-3'>
        <button type="button" className="btn btn-success" onClick={addEntry}>Add</button>
        <Table className='mt-3' columns={columns} dataSource={submissions}/>;

        { form && (
            <Modal
            title={form.formTitle}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={800}
            footer={null}
        >
            {/* Render the new component inside the modal */}
            <FormModal formData={form} submitForm={submitForm} />
        </Modal>
        )}

    </div>
  )
}

export default SeeForm