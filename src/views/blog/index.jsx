import React, { Component } from "react";
import { Container, Image, Button, Card, Tabs, Tab, Form } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author";
import "./styles.css";

const { REACT_APP_BACKEND_URL } = process.env
class Blog extends Component {

  state={
    blog:{},
    loading: true,
    comments:[],
    newComment:{
      name:'',
      comment:''
    },
    deletedComment:"",
    editModeId:'',
    editComments:{
      name:'',
      comment:''
    }
  }

  id = this.props.match.params.id
  url = `${REACT_APP_BACKEND_URL}/blogs/${this.id}`

  fetchSingleBlog = () =>{
    console.log(this.url);
    
     const blogId = this.id
     const blog = this.props.blogs.find(blog => blog.id.toString() === blogId)
     if(this.props.edited){
       this.setState({
         ...this.state,
         blog: this.props.edited,
         loading:false
       })
     }
     else{
       this.setState({
         ...this.state,
         blog,
         loading:false
       })
     }
  }

  componentDidMount(){
    this.fetchSingleBlog()
    this.fetchComments()
    console.log(this.state.blog);
  }

  componentDidUpdate = (prevProps, prevState)=>{
    if((prevState.newComment.name !== this.state.newComment.name) || (prevState.newComment.comment !== this.state.newComment.comment) || (prevState.editComments.name !== this.state.editComments.name) || (prevState.editComments.comment !== this.state.editComments.comment) || (this.state.deletedComment && !this.state.comments.includes(this.state.deletedComment._id))){
      this.setState({
        ...this.state,
        deletedComment:''
      })
      this.fetchComments()
    }
   
  }

  deleteBlog = async (e) =>{
    try {
      const response = await fetch(this.url,{
        method:'DELETE'
      })
      if(response.ok){
        alert('deleted successfully')
        this.setState({
          ...this.state,
          nextPage:true
        })
      }
      else{
        console.log('error in deleting');
      }
    } catch (error) {
      console.log(error);
    }
  } 

  fetchComments = async () =>{
    try {
      const response = await fetch(`${this.url}/comments`)
      const data = await response.json()
      if(response.ok){
        this.setState({
          ...this.state,
          comments:data
        })
      }
      else{
        console.log(`error fetching comments`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  commentInputHandle = (e)=>{
    const id= e.target.id
    this.setState({
      ...this.state,
      newComment:{
        ...this.state.newComment,
        [id]: e.target.value
      }
    })
  }

  postComment = async () =>{
    try {
      const response = await fetch(`${this.url}/comments`,{
        method:'POST',
        body:JSON.stringify(this.state.newComment),
        headers:{
          'content-type':'application/json'
        }
      })
      const data = await response.json()
      if(response.ok){
        alert("comment posted successfully")
        this.setState({
          ...this.state,
          newComment:{
            name:'',
            comment:''
          }
        })
      }
      else{
        console.log("error in posting new comment");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  editComment = async (e) =>{
    try {
      const response = await fetch(`${this.url}/comments/${e.currentTarget.id}`,{
        method:'PUT',
        body:JSON.stringify(this.state.editComments),
        headers:{
          'content-type':'application/json'
        }
      })
      const data = await response.json()
      if(response.ok){
        alert('comment updated successfully')
        this.setState({
          ...this.state,
          editMode:'',
          editComments:{
            name:'',
            comment:''
          }
        })
      }
      else{
        console.log('error updating the comment');
      }
    } catch (error) {
      console.log(error);
    }
  }

  deleteComment = async (e) =>{
    try {
      const response = await fetch(`${this.url}/comments/${e.currentTarget.id}`,{
        method:'DELETE'
      })
      const data = await response.json()
      console.log(data);
      if(response.ok){
        alert('comment deleted successfully')
        this.setState({
          ...this.state,
          deletedComment:data
        })
      }else{
        console.log('error deleting comment');
      }

    } catch (error) {
      console.log(error);
    }
  }

  currentTime =(dataTime) =>{
    let time = new Date(dataTime).toLocaleTimeString()
    return time
}

  currentDate =(dataDate) =>{
    let date = new Date(dataDate).toLocaleDateString()
    return date
}

  render() {
    let {blog, loading } = this.state
    if (loading) {
      return <div>loading</div>;
    } else {
      return (
        <div className="blog-details-root">
          <Container>
            <Image className="blog-details-cover" src={blog.cover} fluid />
            <h1 className="blog-details-title">{blog.title}</h1>

            <div className="blog-details-container">
              <div className="blog-details-author">
                <BlogAuthor authors={blog.authorId} />
              </div>
              <div className="blog-details-info">
                <div>{this.currentDate(blog.createdAt)}</div>
               {/*  <div>{this.currentTime(blog.createdAt)}</div> */}
                <div>{`${blog.read_time_value} ${blog.read_time_unit} read`}</div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>

            <div className="d-flex justify-content-between mt-5 pt-5">
              <div>
                  <Link to={`/edit/${this.id}`}>
                    <Button
                      variant="secondary">
                        Edit Post
                      </Button>
                  </Link> 
              </div>
              <div>
                 
                    <Button
                    href={`${this.url}/pdf`}
                    target="_blank"
                      variant="info">
                        Download PDF
                      </Button>
                  
              </div>
              <div>
           
                    <Button
                    as={Link}
                    to="/"
                      onClick={(e)=>this.deleteBlog(e)} 
                      variant="danger">
                        Delete
                      </Button>
                  
                   
              </div>
            </div> 

             {/* Comments section */}

             <div className="mt-5 blog-comments">
                <Tabs defaultActiveKey="Comments" id="uncontrolled-tab-example">
                  <Tab eventKey="Comments" title="Comments">
                      <div className="mt-5">                                             
                        <div>
                            <Form.Group className="my-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                            id="name"
                            required
                            value={this.state.newComment.name}
                            onChange={(e)=> this.commentInputHandle(e)}
                            size="lg" 
                            placeholder="Name" />
                          </Form.Group>

                          <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control 
                            id="comment"
                            value={this.state.newComment.comment}
                            onChange={(e)=> this.commentInputHandle(e)}
                            as="textarea"
                            placeholder="Comment" 
                            rows={3} />
                          </Form.Group>

                        </div>
                        <Button
                            onClick={(e)=> this.postComment(e)}
                            className="mt-4 mb-4" 
                            variant="primary">
                                Post Comment
                        </Button>

                        <hr/>

                        <div className="mt-5">
                          <h6>{this.state.comments.length} {this.state.comments.length === 1?'Comment':'Comments'}</h6>
                          {this.state.comments.length ? this.state.comments.map( comment =>
                              <div key={comment._id} className="mb-3">                      
                                <Card>
                                  {this.state.editMode === comment._id

                                  ?<>
                                  <Card.Header>
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <Form.Group className="my-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control 
                                        id="name"
                                        required
                                        value={this.state.editComments.name}
                                        onChange={(e)=> this.setState({
                                          ...this.state,
                                          editComments:{
                                            ...this.state.editComments,
                                            name: e.target.value
                                          }
                                        })}
                                        size="lg" 
                                        placeholder="Name" />
                                      </Form.Group>
                                    </div>                                      
                                    <div>                                    
                                      <svg id={comment._id} onClick={(e)=>this.setState({
                                            ...this.state,
                                            editMode:''
                                          })} style={{color:'red'}} focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                    </div>
                                  </div>                                   
                                </Card.Header>
                                <Card.Body>
                                  <div className="d-flex flex-row justify-content-between">
                                    <div className="d-flex">
                                      <div className="pr-5">
                                        <img className="commentAvatar" src ={`https://i.pravatar.cc/150?u=${comment._id}`} alt="avatar"/>
                                      </div>
                                      <div>
                                       <Form.Group>
                                          <Form.Label>Comment</Form.Label>
                                          <Form.Control
                                          id="comment"
                                          value={this.state.editComments.comment}
                                          onChange={(e)=> this.setState({
                                            ...this.state,
                                            editComments:{
                                              ...this.state.editComments,
                                              comment:e.target.value
                                            }
                                          })}
                                          as="textarea"
                                          rows={3} />
                                        </Form.Group>
                                      </div>
                                    </div>
                                    <div className="">
                                        <svg id={comment._id} onClick={(e)=>this.editComment(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-save" viewBox="0 0 16 16">
                                          <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                                        </svg>
                                    </div>
                                  </div>                                
                                </Card.Body>
                                </>

                                  :<>
                                  <Card.Header>
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <h5>By: {comment.name}</h5>
                                      </div>                                      
                                      <div>
                                        <svg id={comment._id} onClick={(e)=>this.deleteComment(e)} style={{color:'red'}} focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                      </div>
                                    </div>                                   
                                  </Card.Header>
                                  <Card.Body>
                                    <div className="d-flex flex-row justify-content-between">
                                      <div className="d-flex">
                                        <div className="pr-5">
                                          <img className="commentAvatar" src ={`https://i.pravatar.cc/150?u=${comment._id}`} alt="avatar"/>
                                        </div>
                                        <div>
                                          <Card.Text>{comment.comment}</Card.Text>
                                        </div>
                                      </div>
                                      <div className="">                                      
                                          <svg id={comment._id} onClick={(e)=>this.setState({
                                            ...this.state,
                                            editMode:e.currentTarget.id,
                                            editComments:{
                                              name:comment.name,
                                              comment:comment.comment
                                            }
                                          })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className="mercado-match" width="20" height="20" focusable="false">
                                          <path d="M21.13 2.86a3 3 0 00-4.17 0l-13 13L2 22l6.19-2L21.13 7a3 3 0 000-4.16zM6.77 18.57l-1.35-1.34L16.64 6 18 7.35z"></path>
                                          </svg> 
                                      </div>
                                    </div>                                
                                  </Card.Body>
                                  </>
                                }
                                  
                                </Card>
                              </div>
                            )
                          :<p>Be first to comment</p>}
                        </div>
                      </div>
                  </Tab>

                  <Tab eventKey="profile" title="Profile">
                  
                  </Tab>
                  <Tab eventKey="contact" title="Contact" disabled>
                  
                  </Tab>
                </Tabs>
          </div>

          </Container>
        </div>
      );
    }
  }
}

export default withRouter(Blog);
