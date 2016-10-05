import React, { Component } from 'react'
import Dropdown from '../components/dropdown.js'

//var regions = getRegions();


class App extends Component {
	constructor (props) {
		super(props);
		this.state = {regions : [], stopCount: []};
	}

	componentDidMount() {
		const stopCount = [30, 40, 50, 60, 70, 80, 90, 100];
		fetch('/data', {
			method: 'GET'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({stopCount: stopCount, regions: data.regions});
		}).catch(function(err) {
			console.log(err);
		});	
    }

	render() {
		return <div>
				 <Dropdown data={this.state.stopCount} />
				 <Dropdown data={this.state.regions} />
			   </div>
	}
}

export default App

