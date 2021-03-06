import React from 'react';
import PropTypes from 'prop-types';

require('./latex.scss');

const propTypes = {
	html: PropTypes.string.isRequired,
	isBlock: PropTypes.bool,
};

const defaultProps = {
	isBlock: false,
};

const LatexStatic = function(props) {
	return (
		<span
			className={`latex-wrapper ${props.isBlock ? 'block' : ''}`}
			dangerouslySetInnerHTML={{ __html: props.html }}
		/>
	);
};

LatexStatic.propTypes = propTypes;
LatexStatic.defaultProps = defaultProps;
export default LatexStatic;
