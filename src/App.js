import React from "react";
import { useState } from "react";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./views/home";
import Blog from "./views/blog";
import NewBlogPost from "./views/new";
import EditBlogPost from "./views/edit"
import AuthorRegister from "./views/authorRegister";
import Authors from "./views/authors/authors.jsx"
import { BrowserRouter, Route } from "react-router-dom";

function App() {

  const [blog, setBlog] = useState([])
  const [editPost, setEditPost] = useState(null)
  const [authors, setAuthors] = useState([])

  const updated =(val)=>{
    setBlog(val)
  }

  const changes = (newVal) => {
    setAuthors(newVal)
  }

  const editedPost =(editVal)=>{
    setEditPost(editVal)
  }

  return (
    <BrowserRouter>
      <Route path="/authorsRegister" exact render={(routerProps)=> <AuthorRegister {...routerProps} /> }/>
      {/* <Route path="/authors" exact render={(routerProps)=> <Authors {...routerProps} /> }/> */}
      <>
        <NavBar />
        <Route path="/" exact render={(routerProps)=> <Home {...routerProps} authors={changes} blogs={updated} /> }/>
        <Route path="/blog/:id" render={(routerProps)=> <Blog {...routerProps} blogs={blog} edited={editPost} /> }/>
        <Route path="/new" exact component={NewBlogPost} />
        <Route path="/edit/:id" exact render={(routerProps)=> <EditBlogPost blogs={blog} authors={authors} edited={editedPost} {...routerProps}/> }/>
        <Footer />
      </>
    </BrowserRouter>
  );
}

export default App;
