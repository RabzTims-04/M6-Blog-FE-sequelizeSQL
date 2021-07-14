import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import BlogItem from "../blog-item";

const { REACT_APP_BACKEND_URL } = process.env
export default class BlogList extends Component {

  state={
    blogs:[]
  }

  url = `${REACT_APP_BACKEND_URL}/blogs`

  fetchBlogs = async () => {
    try {
      const response = await fetch(this.url)
      const data = await response.json()
      console.log(data);
      if(response.ok){
        this.setState({
          blogs: data
        })
        this.props.blogs(data)
       
      }
      else{
        console.log("cannot get blogs");
       
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount =()=>{
    this.fetchBlogs()
  }

  render() {
    return (
      <Row>
        {this.state.blogs.map((blog) => (
          <Col md={4} style={{ marginBottom: 50 }}>
            <BlogItem key={blog.id} {...blog} />
          </Col>
        ))}
      </Row>
    );
  }
}
