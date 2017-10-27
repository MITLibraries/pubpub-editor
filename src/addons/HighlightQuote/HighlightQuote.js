import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./highlightQuote.scss');

const propTypes = {
	to: PropTypes.number,
	from: PropTypes.number,
	id: PropTypes.string,
	exact: PropTypes.string,
	suffix: PropTypes.string,
	prefix: PropTypes.string,
	version: PropTypes.string,
	isSelected: PropTypes.bool,
	isEditable: PropTypes.bool,
};

const defaultProps = {
	to: undefined,
	from: undefined,
	id: undefined,
	exact: undefined,
	suffix: undefined,
	prefix: undefined,
	version: undefined,
	isSelected: false,
	isEditable: false,
};

class Highlight extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
		};
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	handleMouseEnter() {
		this.setState({ active: true });
	}
	handleMouseLeave() {
		this.setState({ active: false });
	}
	render() {
		if (!this.props.exact) { return null; }
		const scrollToClicked = ()=> {
			// console.log(this.props.id);
			const thing = document.getElementsByClassName(this.props.id)[0];
			// console.log(this.props.id, thing);
			thing.scrollIntoView({ behavior: 'smooth' });
		};
		return (
			<div className={`pt-card pt-elevation-2 highlight-quote ${this.props.isSelected ? 'isSelected' : ''}`}>
				{(true || !this.props.isEditable) &&
					<button
						className={'scroll-to-button pt-button pt-small pt-icon-highlight'}
						onClick={scrollToClicked}
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
					/>
				}
				{this.state.active &&
					<style>{`.${this.props.id}:before { opacity: 1; }`}</style>
				}
				<div className={'quote-text'}>
					{this.props.prefix}
					<span className={'highlight-text'}>{this.props.exact}</span>
					{this.props.suffix}
				</div>
			</div>
		);
	}
}

Highlight.propTypes = propTypes;
Highlight.defaultProps = defaultProps;
export default Highlight;