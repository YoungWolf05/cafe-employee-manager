/**
 * CafeForm Component
 * 
 * This component is responsible for rendering a form to add or edit a cafe. It handles form state,
 * data fetching, and form submission using React Query and React Router.
 * 
 * Key functionalities:
 * - Fetches cafe data by ID if an ID is provided in the URL parameters.
 * - Handles form state and updates the state on input changes.
 * - Uses React Query's `useMutation` hook to handle form submission for adding or updating a cafe.
 * - Navigates back to the cafe list page on successful form submission.
 * - Prompts the user with a warning message if there are unsaved changes when attempting to navigate away.
 * 
 * Dependencies:
 * - @mui/material for UI components.
 * - react-router-dom for navigation.
 * - @tanstack/react-query for data fetching and caching.
 * - Custom hooks and utility functions for handling prompts and messages.
 */
import { addCafe, fetchCafeById, updateCafe } from '../services/api';
import { Button, Container, TextField, Typography } from '@mui/material';
import { LOGO_FILE_SIZE_WARNING_MESSAGE, UNSAVED_CHANGES_MESSAGE } from '../utils/messageConfig';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrompt } from '../hooks/usePrompt';

const CafeForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the cafe ID from the URL parameters
  const [formState, setFormState] = useState({ name: '', description: '', location: '', logo: null });
  const [isDirty, setIsDirty] = useState(false);

  usePrompt(UNSAVED_CHANGES_MESSAGE, isDirty);

  useEffect(() => {
    if (id) {
      fetchCafeById(id).then((response) => {
        setFormState({
          name: response.name || '',
          description: response.description || '',
          location: response.location || '',
          logo: null, // Assuming logo is not fetched from the API
        });
      }).catch((error) => {
        console.error('Error fetching cafe:', error);
      });
    }
  }, [id]);

  const cafeData = {
    name: formState.name,
    description: formState.description,
    location: formState.location,
    ...(formState.logo && { logo: formState.logo.name }),
  };

  const mutation = useMutation({
    mutationFn: id ? () => updateCafe(id, cafeData) : () => addCafe(cafeData),
    onSuccess: () => {
      queryClient.invalidateQueries('cafes');
      navigate('/'); // Navigate back to the cafes list page
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.logo && formState.logo.size > 2 * 1024 * 1024) {
      alert(LOGO_FILE_SIZE_WARNING_MESSAGE);
      return;
    }
    mutation.mutate();
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm(UNSAVED_CHANGES_MESSAGE)) {
      return;
    }
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Cafe' : 'Add New Cafe'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={formState.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          slotProps={{ htmlInput: { minLength: 6, maxLength: 10 } }}
        />
        <TextField
          name="description"
          label="Description"
          value={formState.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          slotProps={{ htmlInput: { maxLength: 256 } }}
        />
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          style={{ margin: '20px 0' }}
        />
        <TextField
          name="location"
          label="Location"
          value={formState.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
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

export default CafeForm;