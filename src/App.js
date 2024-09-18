import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FormBuilder from './pages/FormBuilder';
import SeeForm from './pages/SeeForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder/:formId" element={<FormBuilder />} />
        <Route path="/form/:formId" element={<SeeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
