import React from 'react';
import PropTypes from 'prop-types';
import GitHubRepo from './GitHubRepo';

require('./gitHub.scss');

const propTypes = {
	repo: PropTypes.object
};

const defaultProps = {
	repo: null
};

const GitHubStatic = function(props) {
	if (!props.repo) {
		return null;
	}

	return (
		<div className="github-wrapper pt-card pt-elevation-2">
			<div className="github-static">
				<GitHubRepo
					description={props.repo.description}
					full_name={props.repo.full_name}
					html_url={props.repo.html_url}
					language={props.repo.language}
					stargazers_count={props.repo.stargazers_count}
					updated_at={props.repo.updated_at}
				/>
			</div>
		</div>
	);
};

GitHubStatic.propTypes = propTypes;
GitHubStatic.defaultProps = defaultProps;
export default GitHubStatic;
