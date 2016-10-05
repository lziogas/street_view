import React, { Component } from 'react'

class Dropdown extends React.Component {

    constructor (props) {
        super(props);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    componentDidMount() {
        console.log(this.props);
    }
    render() {
        return (
            <span></span>
            /*<select onChange={this.handleChange.bind(this)}>
                {this.props.data.map((item) => {
                  return <option key={item} value={item}>{item}</option>
                })}
            </select>*/
        );
      }
}

export default Dropdown

/*<select onChange={this.handleChange} value={this.state.value}>
<option value="A">Apple</option>
<option value="B">Banana</option>
<option value="C">Cranberry</option>
</select>*/