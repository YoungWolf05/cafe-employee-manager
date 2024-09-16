/**
 * CafePage Component
 * 
 * This component is responsible for displaying a list of cafes. It fetches the cafe data
 * from the backend API and provides functionalities to add, edit, delete, and view employees
 * of a specific cafe.
 * 
 * Key functionalities:
 * - Fetches cafe data using React Query's `useQuery` hook.
 * - Provides functionality to add, edit, and delete cafes.
 * - Uses `AgGridReact` to display the cafe data in a table format.
 * - Handles navigation to the cafe form for adding or editing cafes.
 * - Handles navigation to the employee page to view employees of a specific cafe.
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
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { CAFE_FORM_ROUTE, EMPLOYEE_PAGE_ROUTE } from '../utils/routes';
import { DELETE_CAFE_MESSAGE, ERROR_LOADING_CAFES_MESSAGE, LOADING_MESSAGE } from '../utils/messageConfig';
import { deleteCafe, fetchCafes } from '../services/api';
import { GRID_CONFIG } from '../utils/gridConfig';

const CafePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCafe(id),
    onSuccess: () => {
      queryClient.invalidateQueries('cafes'); // Invalidate the 'cafes' query to refresh the data
    },
  });

  const handleAdd = () => {
    navigate(`/${CAFE_FORM_ROUTE}`);
  };

  const handleEdit = (id) => {
    navigate(`/${CAFE_FORM_ROUTE}/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(DELETE_CAFE_MESSAGE)) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewEmployees = (cafeName) => {
    navigate(`/${EMPLOYEE_PAGE_ROUTE}/${cafeName}`);
  };

  const handleViewAllEmployees = () => {
    navigate(`/${EMPLOYEE_PAGE_ROUTE}`);
  };

  if (isLoading) return <div>{LOADING_MESSAGE}</div>;
  if (error) return <div>{ERROR_LOADING_CAFES_MESSAGE}</div>;

  return (
    <div>
      <h1>Cafes</h1>
      <div className="button-container">
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add New Cafe
        </Button>
        <Button variant="contained" color="secondary" onClick={handleViewAllEmployees}>
          View All Employees
        </Button>
      </div>
        <div className="ag-theme-alpine">
            <AgGridReact
              rowData={data?.data}
              columnDefs={[
                { field: 'logo', headerName: 'Logo', flex: 1 },
                { field: 'name', headerName: 'Name', flex: 1 },
                { field: 'description', headerName: 'Description', flex: 1 },
                { field: 'location', headerName: 'Location', flex: 1 },
                {
                  headerName: 'Employees',
                  flex: 1,
                  cellRenderer: (params) => (
                    <div>
                      <Button onClick={() => handleViewEmployees(params.data.name)}>View</Button>
                    </div>
                  ),
                },
                {
                  headerName: 'Actions',
                  flex: 1,
                  cellRenderer: (params) => (
                    <div>
                      <Button onClick={() => handleEdit(params.data.id)}>Edit</Button>
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

export default CafePage;
