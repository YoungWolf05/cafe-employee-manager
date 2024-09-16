/**
 * App Component
 * 
 * This is the main component of the application that sets up the routing for different pages.
 * It uses `react-router-dom` to define routes for viewing, adding, and editing cafes and employees.
 * 
 * Key functionalities:
 * - Defines routes for viewing all cafes, adding a new cafe, and editing an existing cafe.
 * - Defines routes for viewing all employees, viewing employees under a specific cafe, adding a new employee, and editing an existing employee.
 * - Uses the `Routes` and `Route` components from `react-router-dom` to handle client-side routing.
 * 
 * Dependencies:
 * - react-router-dom for routing.
 * - Components: `CafePage`, `CafeForm`, `EmployeePage`, `EmployeeForm`.
 * - Utility constants for route paths from `src/utils/routes.js`.
 */
import { Routes, Route } from 'react-router-dom';
import CafePage from './components/CafePage';
import CafeForm from './components/CafeForm';
import EmployeeForm from './components/EmployeeForm';
import EmployeePage from './components/EmployeePage';
import { CAFE_PAGE_ROUTE, CAFE_FORM_ROUTE, EMPLOYEE_PAGE_ROUTE, EMPLOYEE_FORM_ROUTE } from './utils/routes';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CafePage />} /> {/* For viewing all cafes */}
        <Route path={`/${CAFE_PAGE_ROUTE}`} element={<CafePage />} /> {/* For viewing all cafes */}
        <Route path={`/${CAFE_FORM_ROUTE}`} element={<CafeForm />} /> {/* For adding */}
        <Route path={`/${CAFE_FORM_ROUTE}/:id`} element={<CafeForm />} /> {/* For editing */}
        <Route path={`/${EMPLOYEE_PAGE_ROUTE}`} element={<EmployeePage />} /> {/* For viewing all employees */}
        <Route path={`/${EMPLOYEE_PAGE_ROUTE}/:cafeName`} element={<EmployeePage />} /> {/* For viewing employees under a cafe */}
        <Route path={`/${EMPLOYEE_FORM_ROUTE}`} element={<EmployeeForm />} /> {/* For adding */}
        <Route path={`/${EMPLOYEE_FORM_ROUTE}/:id`} element={<EmployeeForm />} /> {/* For editing */}
      </Routes>
    </div>
  );
}

export default App;
