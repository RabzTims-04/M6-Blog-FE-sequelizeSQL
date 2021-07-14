import React, { Component } from "react";
import { createRef } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";

const {REACT_APP_BACKEND_URL} = process.env
export default class NewBlogPost extends Component {

  ref = createRef()

  state={
    authors:[],
    authorId:'',
    nextPage:false,
    blog:{
	    "category": "",
	    "title": "",
	    "cover":"https://avatarfiles.alphacoders.com/896/thumb-89615.png",
      "content":"",
	    "authorId":[]
    }
  }

  url = `${REACT_APP_BACKEND_URL}/blogs`
  authorUrl = `${REACT_APP_BACKEND_URL}/authors`

  fetchAuthors = async () =>{
    try {
      const response = await fetch(this.authorUrl)
      const data = await response.json()
      console.log(data);
      if (response.ok) {
        this.setState({
          ...this.state,
          authors:data
        })
      } else {
        console.log("error fetching authors");
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount = () =>{
    this.fetchAuthors()
  }

  addBlog = async (e) =>{
    e.preventDefault()
    let formData = new FormData()
    formData.append('cover', this.state.blog.image)
    try {
      const authorId = this.state.authors.find(author => author.name.includes(this.state.blog.authorId.split(' ')[0])).id
      const response = await fetch(this.url,{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify({
          category:this.state.blog.category,
          title:this.state.blog.title,
          cover:this.state.blog.cover,
          content:this.state.blog.content,
          authorId: [authorId]
        })
      })
      const data = await response.json()
      const blogId = await data.id
      if(response.ok){
        if(this.state.blog.image){
          try {
            const postCover = await fetch(`${this.url}/${blogId}/cover`,{
              method:'POST',
              body: formData
            })
            if(postCover.ok){
              const coverData = await postCover.json()
              console.log(coverData);
            }
          } catch (error) {
            console.log(error);
          }
        }
        alert('Data successfully posted :)')
        this.setState({
          blog:{
            "category": "",
            "title": "",
            "cover":"",
            "content":"",
            "authorId":[]
          }
        })
      }
      else{
        console.log("error during adding a new post");
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5" onSubmit = {(e)=> this.addBlog(e)}>

         <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
            id="title"
            value={this.state.blog.title}
            onChange={(e)=> this.setState({
              blog:{
                ...this.state.blog,
                title: e.target.value
              }
            })}
            size="lg" 
            required
            placeholder="Title" />
          </Form.Group>

          <label className="p-0 d-flex mt-2" for="image">                                     
            <input 
              onClick={(e)=> {e.stopPropagation()
                      return true}}  
              hidden
              type="file"
              id="image"
              ref={this.ref}
              onChange={(e) => {this.setState({
                      ...this.state,
                        blog:{...this.state.blog, 
                        image: e.target.files[0]}
                      })
                      console.log(e.target.files[0])}}
            />
          </label> 
          <Button
            onClick={()=> this.ref.current.click()}
            variant="dark"
            className="mt-3"
          >
            Upload Cover
          </Button>

          <Form.Group controlId="blog-category" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control 
            id="category"
            required
            value={this.state.blog.category}
            onChange={(e)=> this.setState({
              blog:{
                ...this.state.blog,
                category: e.target.value                  
              }
            })}
            size="lg" 
            as="select">
              <option>Category1</option>
              <option>Category2</option>
              <option>Category3</option>
              <option>Category4</option>
              <option>Category5</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Authors</Form.Label>
            <Form.Control 
            id={this.state.authorId}
            required
            value={this.state.blog.authorId}
            onChange={(e)=> {
              console.log(e.target.value);
              console.log(e.target[e.target.selectedIndex].id);
              this.setState({
                ...this.state,
              blog:{
                ...this.state.blog,
                authorId: e.target.value                  
              }
            })
      
          }}
            size="lg" 
            as="select">
              {this.state.authors && this.state.authors.map( author => 
              <option key={author.id} id={author.id} >{author.name} {author.surname} </option>
              )}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <ReactQuill
              value={this.state.blog.content}
              onChange={(e)=> this.setState({
                blog:{
                  ...this.state.blog,
                  content: e                  
                }
              })}
              className="new-blog-content"
            />
          </Form.Group>

          <Form.Group className="d-flex mt-3 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark">
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="dark"
              style={{ marginLeft: "1em" }}
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
