
/**
 * EmployeePage Component
 * 
 * This component is responsible for displaying a list of employees. It fetches the employee data
 * from the backend API, either for all employees or filtered by a specific cafe if a cafe name is provided.
 * 
 * Key functionalities:
 * - Fetches employee data using React Query's `useQuery` hook.
 * - Provides functionality to add, edit, and delete employees.
 * - Uses `AgGridReact` to display the employee data in a table format.
 * - Handles navigation to the employee form for adding or editing employees.
 * - Displays loading and error messages based on the data fetching state.
 * 
 * Dependencies:
 * - @mui/material for UI components.
 * - react-router-dom for navigation.
 * - @tanstack/react-query for data fetching and caching.
 * - ag-grid-react for displaying data in a table format.
 * - Custom utility functions and constants for configuration and messages.
 */

import { AgGridReact } from 'ag-grid-react';
import { Button } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { deleteEmployee, fetchEmployees, fetchEmployeesByCafe } from '../services/api';
import { DELETE_EMPLOYEE_MESSAGE, ERROR_LOADING_EMPLOYEES_MESSAGE, LOADING_MESSAGE } from '../utils/messageConfig';
import { GRID_CONFIG } from '../utils/gridConfig';
import { EMPLOYEE_FORM_ROUTE, CAFE_PAGE_ROUTE } from '../utils/routes';

const EmployeePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { cafeName } = useParams();
  const { data, error, isLoading  } = useQuery({
    queryKey: cafeName ? ['employees', cafeName] : ['employees'],
    queryFn: () => (cafeName ? fetchEmployeesByCafe(cafeName) : fetchEmployees()),
    enabled: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries('employees'); 
    },
  });

  const handleAdd = () => {
    navigate(`/${EMPLOYEE_FORM_ROUTE}`);
  };
  
  const handleEdit = (employee) => {
    navigate(`/${EMPLOYEE_FORM_ROUTE}/${employee.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(DELETE_EMPLOYEE_MESSAGE)) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewEmployees = () => {
    navigate(`/${CAFE_PAGE_ROUTE}`);
  };

  if (isLoading) return <div>{LOADING_MESSAGE}</div>;
  if (error) return <div>{ERROR_LOADING_EMPLOYEES_MESSAGE}</div>;

  return (
    <div>
      <h1>Employees {cafeName}</h1>
      <div className='button-container'>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add New Employee
        </Button>
        <Button variant="contained" color="secondary" onClick={handleViewEmployees}>
          View All Cafes
        </Button>
      </div>
        <div className="ag-theme-alpine">
          <AgGridReact
            rowData={data?.data}
            columnDefs={[
              { field: 'id', flex: 1 },
              { field: 'name', flex: 1 },
              { field: 'email_address', flex: 1 },
              { field: 'phone_number', flex: 1 },
              { field: 'daysWorked', flex: 1 },
              { field: 'cafe.name', flex: 1 },
              {
                headerName: 'Actions',
                flex: 1,
                cellRenderer: (params) => (
                  <div>
                    <Button onClick={() => handleEdit(params.data)}>Edit</Button>
                    <Button onClick={() => handleDelete(params.data.id)}>Delete</Button>
                  </div>
                ),
              },
            ]}
            domLayout="autoHeight"
            gridOptions={GRID_CONFIG}
          />
        </div>
    </div>
  );
};

export default EmployeePage;