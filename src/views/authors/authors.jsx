import React, { Component } from 'react';

const {REACT_APP_BACKEND_URL} = process.env
class Authors extends Component {

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
            <div>
                
            </div>
        );
    }
}

export default Authors;