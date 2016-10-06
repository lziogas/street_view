import React, { Component } from 'react'

class Dropdown extends React.Component {

    constructor (props) {
        super(props);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.data[0]
        });
    }

    render() {
        return (
            <select onChange={this.handleChange.bind(this)}>
                {this.props.data.map((item) => {
                  return <option key={item} value={item}>{item}</option>
                })}
            </select>
        );
      }
}

export default Dropdown