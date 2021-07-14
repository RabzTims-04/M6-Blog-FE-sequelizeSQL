import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createRef } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Container, Form, Button } from "react-bootstrap";
import "./style.css";

const {REACT_APP_BACKEND_URL} = process.env

 class EditBlogPost extends Component {

  ref = createRef()

  state={
    blog:{
	    "category": "",
	    "title": "",
	    "cover":"",
      "content":"",
	    "authorId":''
    }
  }

  url = `${REACT_APP_BACKEND_URL}/blogs`

  id=this.props.match.params.id
  componentDidMount = () => {
    console.log('authors',this.props.authors);
    const { id } = this.props.match.params;
    console.log('id', id);
    console.log('blogs',this.props.blogs);
    const blog =  this.props.blogs.find((post) => post.id.toString() === id);
    const author = this.props.authors.find(author => author.id === blog.authorId)
    console.log('author', author.name);
    if (blog) {      
      this.setState({ 
            blog:{
                "category": blog.category,
                "title": blog.title,
                "cover":blog.cover,
                "content":blog.content,
                "authorId": author.name +' ' + author.surname
            }
       });
    }
  }

  editBlog = async (e)=>{
    e.preventDefault()
    let formData = new FormData()
    formData.append('cover', this.state.blog.image)

    try {
      const authorId = this.props.authors.find(author => author.name.includes(this.state.blog.authorId.split(' ')[0])).id
      const response = await fetch(`${this.url}/${this.id}`,{
        method:"PUT",
        body: JSON.stringify({
          category:this.state.blog.category,
          title:this.state.blog.title,
          cover:this.state.blog.cover,
          content:this.state.blog.content,
          authorId:authorId
        }),
        headers:{
          "content-type": "application/json"
        }
      })
      const data = await response.json()
      const blogId= await data.id
      if(response.ok){
        if(this.state.blog.image){
          try {
            const postCover = await fetch(`${this.url}/${blogId}/cover`,{
              method:'POST',
              body: formData
            })
            if(postCover.ok){
              const coverdata = await postCover.json()
              console.log(coverdata);
            }
          } catch (error) {
            console.log(error);
          }
        }
        this.props.edited(data)
        alert('blog post is successfully edited')
        this.setState({
          ...this.state.blog
        })
      }
      else{
        console.log('edit unsuccessful');
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5" onSubmit={(e)=>this.editBlog(e)}>
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
              id="image"
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

{/*            <Form.Group  className="mt-3">
            <Form.Label>Cover Image</Form.Label>
            <Form.Control
            required 
            type="text"
            id="cover"
            value={this.state.blog.cover}
            onChange={(e)=> this.setState({
              blog:{
                ...this.state.blog,
                cover: e.target.value
              }
            })}
            size="lg" 
            placeholder="Link" />
          </Form.Group> */}

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
            id="author"
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
              {this.props.authors && this.props.authors.map( author => 
              <option key={author.id} id={author.id} >{author.name} {author.surname} </option>
              )}
            </Form.Control>
          </Form.Group>

         {/*  <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Author Name</Form.Label>
            <Form.Control 
            id="author"
            type="text"
            required
            value = {this.state.blog.author}
            onChange={(e)=> {
              console.log(this.state.blog.author);
              console.log(this.props.authors.find(author => author.id === this.state.blog.author[0]).name);
              this.setState({
              blog:{
                ...this.state.blog,
                author:e.target.value                
              }
            })}}
            size="lg" 
            placeholder="Name" />
          </Form.Group> */}

         {/*  <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Author SurName</Form.Label>
            <Form.Control 
            id="surname"
            required
            value={this.state.blog.author[0].surname}
            onChange={(e)=> this.setState({
              blog:{
                ...this.state.blog,
                author:[{
                  ...this.state.blog.author[0],
                  surname: e.target.value
                } ]                  
              }
            })}
            size="lg" 
            placeholder="Name" />
          </Form.Group> */}

         {/*  <Form.Group  className="mt-3">
            <Form.Label>Author's Image</Form.Label>
            <Form.Control 
            type="text"
            id="avatar"
            required
            value={this.state.blog.author[0].avatar}
            onChange={(e)=> this.setState({
              blog:{
                ...this.state.blog,
                author:[
                  {...this.state.blog.author[0],
                  avatar: e.target.value}
                ]
                                   
              }
            })}
            size="lg" 
            placeholder="Link" />
          </Form.Group> */}

          <Form.Group  className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <ReactQuill
              required
              id="content"
              /* onChange={(e)=> console.log(e)} */
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
            <Link to={`/blog/${this.id}`}>
              <Button type="reset" size="lg" variant="outline-dark">
                Back to Blog Page
              </Button>
            </Link>
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

export default EditBlogPost
