import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

const Register = props => {
  const { login } = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label='Username'
          placeholder='Username'
          name='username'
          value={values.username}
          onChange={onChange}
          error={!!errors.username}
          type='text'
        />
        <Form.Input
          label='Email'
          placeholder='Email'
          name='email'
          value={values.email}
          onChange={onChange}
          type='email'
          error={!!errors.email}
        />
        <Form.Input
          label='Password'
          placeholder='Password'
          name='password'
          value={values.password}
          onChange={onChange}
          type='password'
          error={!!errors.password}
        />
        <Form.Input
          label='Confirm password'
          placeholder='Confirm password'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={onChange}
          type='password'
          error={errors.confirmPassword ? true : false}
        />
        <Button type='submit' primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
