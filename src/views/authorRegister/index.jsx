import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import "./styles.css"

const { REACT_APP_BACKEND_URL } = process.env 

class AuthorRegister extends Component {

    state={
        authors:{
            name:'',
            surname:"",
            email:"",
            avatar:"https://i.pinimg.com/originals/03/4b/de/034bde783ea726b922100c86547831e8.jpg"
        }
    }

    handleChange = (e) =>{
        const id = e.target.id
        this.setState({
            authors:{
                ...this.state.authors,
                [id]:e.target.value
            }
        })
    }

    url = `${REACT_APP_BACKEND_URL}/authors`

    addAuthor = async(e) => {
        try {
            const response = await fetch(this.url,{
                method:'POST',
                body:JSON.stringify(this.state.authors),
                headers:{
                    'content-type':'application/json'
                }
            })
            const data = await response.json()
            if (response.ok) {
                alert("author details posted successfully")
                this.setState({
                    authors:{
                        name:'',
                        surname:'',
                        email:'',
                        avatar:""
                    }
                })
            } else {
                console.log('error in posting author details');
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <Container className="mt-5 pt-5">
                <Row  className="mt-5">
                    <Col md={{span: 4, offset: 4}}>
                    <div className="d-flex justify-content-between mb-5">
                        <img
                            className="avatar" 
                            src="https://i.pinimg.com/originals/03/4b/de/034bde783ea726b922100c86547831e8.jpg" 
                            alt="avatar"
                            />
                        <h4 className="text-center pt-3 mt-2">Author Details</h4>
                   </div>
                         <Form>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Name and Surname</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl 
                                id="name"
                                value={this.state.authors.name}
                                onChange={(e)=> this.handleChange(e)}
                                placeholder="Name"
                                 />
                                <FormControl 
                                id="surname"
                                value={this.state.authors.surname}
                                onChange={(e)=> this.handleChange(e)}
                                placeholder="Surname" 
                                />
                            </InputGroup>

                            <Form.Group controlId="formBasicEmail" className="mt-4">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                id="email" 
                                value={this.state.authors.email}
                                onChange={(e)=> this.handleChange(e)}
                                type="email" 
                                placeholder="Enter email" />
                                <Form.Text 
                                className="text-muted">
                                We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>                          

                            <Button 
                            onClick={(e) => this.addAuthor(e)}
                            variant="primary" 
                            className="mt-4" 
                            >
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
                
            </Container>
        );
    }
}

export default AuthorRegister;