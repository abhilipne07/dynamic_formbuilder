import React, { useEffect, useState } from 'react'
import { Button, Popconfirm } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();

  const [allForms, setAllForms] = useState(null)

  const creatForm = () => {
    const uniqueId = uuidv4();
    navigate(`/builder/${uniqueId}`)
  }

  const getForms = async () => {
    try {
        const response = await axios.get('https://app-data-2.onrender.com/forms');
        setAllForms(response.data)
    } catch (error) {
        console.error("Error fetching gate info:", error);
    }
};

const openForm = (uniqueId) => {
  navigate(`/form/${uniqueId}`)
}

const editForm = (uniqueId) => {
  navigate(`/builder/${uniqueId}`)
}

const deleteForm = async (form) => {
  try {
    const jay = await axios.delete(`https://app-data-2.onrender.com/forms/${form.id}`)
    getForms()
  } catch (error) {
    console.log("error =>", error)
  }
}

  useEffect(() => {
    getForms()
  },[])

  return (
    <div className='container mt-5'>
      <Button type="primary" onClick={creatForm}>Create Form</Button>
      <div className='d-flex mt-5'>
        {
          allForms && allForms.length > 0 && allForms.map((form) => {
            return (
                <div className="card me-4" key={form.id} style={{width: "18rem"}}>
                  <div className="card-body">
                    <div className='d-flex justify-content-between'>
                      <h5 className="card-title">{form.formTitle}</h5>
                      <Popconfirm
                        title="Delete the Form"
                        description="Are you sure to delete this Form?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => deleteForm(form)}
                      >
                        <Button danger size="small"><i class="bi bi-trash"></i></Button>
                      </Popconfirm>
                    </div>
                    <button type="button" className="btn btn-success me-2" onClick={() =>editForm(form.formId)}>Edit Form</button>
                    <button type="button" className="btn btn-secondary" onClick={() =>openForm(form.formId)}>See Form</button>
                  </div>
                </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home