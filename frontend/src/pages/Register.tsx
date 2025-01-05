import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CreateUser } from '../graphql/Mutation';
import { useContext } from 'react';
import { AuthContext } from '../component/Authprovider'; 
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const Navigate=useNavigate()
    useEffect(()=>{
const token=localStorage.getItem("authToken")
if(token){
    // Navigate("/")
}
    },[])
    const xstate=useContext(AuthContext)
    const {userLogin,setuserLogin}:any=xstate
  const [createUser, { data, error, loading }] = useMutation(CreateUser);

  // Use useState to store form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Destructure the input's name and value
    setFormData(prevState => ({
      ...prevState, // Copy the existing data
      [name]: value // Update the specific field with the new value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent defa

    try {
      await createUser({ variables: formData });
      console.log('User created successfully:', data.createUser.token);
    } catch (err: any) {
      console.error('Error creating user:', err.message);
    }
  };

  useEffect(() => {
    if (data) {
      console.log('Mutation response data:', data.createUser.token);
      localStorage.setItem("authToken", data.createUser.token);
setuserLogin(true)
    }

    if (error) {
      console.error('Mutation error:', error.message);
    }
  }, [data, error]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          value={formData.firstName}
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          onChange={handleChange}
          value={formData.lastName}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && <p style={{ color: 'green' }}>User created successfully!</p>}
    </div>
  );
};

export default Register;
