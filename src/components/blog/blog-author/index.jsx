import React, { Component } from "react";
import { Row, Col, Image } from "react-bootstrap";
import "./styles.css";

const { REACT_APP_BACKEND_URL } = process.env

export default class BlogAuthor extends Component {

  state={
    authors:{}
  }
  
  url = `${REACT_APP_BACKEND_URL}/authors`

  componentDidMount = () => {
    this.fetchAuthor()
  }

  fetchAuthor = async () => {
    try {
      const response = await fetch(`${this.url}/${this.props.authors}`)
      const data = await response.json()
      console.log(data);
      if(response.ok){
        this.setState({
          authors:data
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() { 
    return (

      this.state.authors && <Row>
        <Col xs={2}>
          <Image className="blog-author" src={this.state.authors.avatar} roundedCircle />
        </Col>
        <Col>
          <div>by</div>
          <h6>{this.state.authors.name} {this.state.authors.surname}</h6>
          <p>Contact Me: {this.state.authors.email}</p>
        </Col>
      </Row>
      )
  }
}
