import React from 'react'
import {Form, Row, Button, Col, Card, Alert, Container} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup' 
import { registerUser } from '../../api/auth'
import { Link, useHistory } from 'react-router-dom'
import styled from "styled-components";
import gambar from "../Login/img/buku3.jpg";
import "./style.css";

const schema = yup.object({
  full_name: yup.string().required('Nama Lengkap harus diisi'),
  email: yup.string().email().required('Email harus valid'),
  password: yup.string().min(8, 'Minimal panjang password harus 8 karakter').required('Password Harus diisi'),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Password konfirmasi tidak sama'),
}).required();


const statusList = {
  idle: 'idle',
  process: 'process',
  success: 'success',
  error: 'error'
}

const Gambar = styled.body`
    background-image: url(${gambar});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: fixed;
    width:100% ;
    height:100% 
`;

export default function Register() {
  const {register, handleSubmit, formState: {errors}, setError} = useForm({
    resolver: yupResolver(schema)
  });
  const [status, setStatus] = React.useState(statusList.idle);
  const history = useHistory();

  const onSubmit = async formData => {
    setStatus(statusList.process);
    const { data } = await registerUser(formData);
    if(data.error) {
      let fields = Object.keys(data.fields);
      fields.forEach(field => setError(field, {type: 'server', message: data.fields[field]?.properties?.message}));
      setStatus(statusList.error);
      return;
    }
    setStatus(statusList.success);
  }

  return (
    <Gambar>

    <Container className='card-register'>
      { status === statusList.success ?
      <Alert variant='success'>
        Registrasi berhasil silahkan {' '}
        <Alert.Link onClick={() => history.push('/login')}>Login</Alert.Link> dengan email dan password anda
      </Alert>: null
      }
      <Card style={{width:"100%"}}>
        <Card.Header>Registration</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Nama</Form.Label>
                <Form.Control 
                  type="text" 
                  isInvalid={errors.full_name}
                  placeholder="Masukan nama lengkap" 
                  {...register('full_name')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.full_name?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Masukan email" 
                  isInvalid={errors.email}
                  {...register('email')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  isInvalid={errors.password}
                  {...register('password')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPasswordConfirmation">
                <Form.Label>Konfirmasi Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Konfirmasi Password" 
                  isInvalid={errors.password_confirmation}
                  {...register('password_confirmation')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password_confirmation?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" disabled={status === statusList.process}>
              { status === statusList.process ? 'Memproses...' : 'Mendaftar'}
            </Button>
          </Form>
            <Link to="/" className="text-dark" style={{marginLeft:`40%`,fontSize:`18px`}}>
              Login
            </Link>
        </Card.Body>
      </Card>
    </Container>

    </Gambar>
  )
}
