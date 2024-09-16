/**
 * EmployeeForm Component
 * 
 * This component is responsible for rendering a form to add or edit an employee. It handles form state,
 * data fetching, and form submission using React Query and React Router.
 * 
 * Key functionalities:
 * - Fetches employee data by ID if an ID is provided in the URL parameters.
 * - Fetches the list of cafes to populate the cafe selection dropdown.
 * - Handles form state and updates the state on input changes.
 * - Uses React Query's `useMutation` hook to handle form submission for adding or updating an employee.
 * - Navigates back to the employee page on successful form submission.
 * - Prompts the user with a warning message if there are unsaved changes when attempting to navigate away.
 * 
 * Dependencies:
 * - @mui/material for UI components.
 * - react-router-dom for navigation.
 * - @tanstack/react-query for data fetching and caching.
 * - Custom hooks and utility functions for handling prompts and messages.
 */
import { Button, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { addEmployee, fetchCafes, fetchEmployeeById, updateEmployee } from '../services/api';
import { usePrompt } from '../hooks/usePrompt';
import { EMPLOYEE_PAGE_ROUTE } from '../utils/routes';
import { UNSAVED_CHANGES_MESSAGE } from '../utils/messageConfig';

const EmployeeForm = ({ employee }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formState, setFormState] = useState(employee || { name: '', email_address: '', phone_number: '', gender: '', cafe: '' });
  const [isDirty, setIsDirty] = useState(false);

  usePrompt(UNSAVED_CHANGES_MESSAGE, isDirty);

  useEffect(() => {
    if (id) {
      fetchEmployeeById(id).then((data) => {
        setFormState({
          name: data.name,
          email_address: data.email_address,
          phone_number: data.phone_number,
          gender: data.gender,
          cafe: data.cafe?.id
        });
      });
    }
  }, [id]);

  const { data: cafes } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
  });

  const submitMutation = useMutation({
    mutationFn: id ? () => updateEmployee(id, formState) : () => addEmployee(formState),
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      navigate(`/${EMPLOYEE_PAGE_ROUTE}`);
    },
  });

  const handleCafeChange = (e) => {
    const cafeId = e.target.value;
    setFormState((prevState) => ({
      ...prevState,
      cafe: cafeId,
    }));
    setIsDirty(true);
  };

  const handleStateChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm(UNSAVED_CHANGES_MESSAGE)) {
      return;
    }
    if (formState.cafe.name) {
      navigate(`/${EMPLOYEE_PAGE_ROUTE}/${formState.cafe.name}`);
    } else {
      navigate(`/${EMPLOYEE_PAGE_ROUTE}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Employee' : 'Add New Employee'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={formState.name}
          onChange={handleStateChange}
          required
          fullWidth
          margin="normal"
          slotProps={{ htmlInput: { minLength: 6, maxLength: 10 } }}
        />
        <TextField
          name="email_address"
          label="Email"
          value={formState.email_address}
          onChange={handleStateChange}
          required
          fullWidth
          margin="normal"
          type="email"
        />
        <TextField
          name="phone_number"
          label="Phone"
          value={formState.phone_number}
          onChange={handleStateChange}
          required
          fullWidth
          margin="normal"
          slotProps={{ htmlInput: { pattern: '[89][0-9]{7}' } }}
        />
        <RadioGroup name="gender" value={formState.gender} onChange={handleStateChange} row>
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
        <FormControl fullWidth margin="normal">
          <InputLabel id="cafe-label">Assigned Café</InputLabel>
          <Select
            labelId="cafe-label"
            name="cafe"
            value={formState.cafe || ''}
            onChange={handleCafeChange}
          >
            {cafes?.data.map((cafe) => (
              <MenuItem key={cafe.id} value={cafe.id}>
                {cafe.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleCancel}
          style={{ marginTop: '10px' }}
        >
          Cancel
        </Button>
      </form>
    </Container>
  );
};

export default EmployeeForm;
