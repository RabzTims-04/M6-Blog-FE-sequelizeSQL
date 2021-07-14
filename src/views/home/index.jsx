import React, { Component } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list";
import "./styles.css";

const {REACT_APP_BACKEND_URL} = process.env
export default class Home extends Component {

  state={
    authors:[]
}

url = `${REACT_APP_BACKEND_URL}/authors`

componentDidMount = () => {
    this.fetchAuthors()
}
  
  fetchAuthors = async () =>{
    try {
        const response = await fetch(this.url)
        const data = await response.json()
        console.log(data);
        this.props.authors(data)
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
      <Container fluid="sm">
        <h1 className="blog-main-title">Welcome to the Strive Blog!</h1>
        <BlogList blogs={this.props.blogs} />
      </Container>
    );
  }
}
