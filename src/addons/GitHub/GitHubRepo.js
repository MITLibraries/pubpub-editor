import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const propTypes = {
	description: PropTypes.string,
	html_url: PropTypes.string.isRequired,
	language: PropTypes.string,
	stargazers_count: PropTypes.number,
	updated_at: PropTypes.string.isRequired
};

const defaultProps = {
	description: '',
	language: '',
	stargazers_count: 0
};

class GitHubRepo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			updated_at: moment(this.props.updated_at).format('MMM DD, YYYY')
		}
	}

	render() {
		return (
			<div className={'github-repo'}>
				<div className={'github-repo-col1'}>
					<h3 className={'github-repo-name'}><a href={this.props.html_url} target={'_blank'}>{this.props.full_name}</a></h3>
					<p className={'github-repo-description'}>{this.props.description}</p>
					<div className={'github-repo-updated-at'}>Updated on {this.state.updated_at}</div>
				</div>
				<div className={'github-repo-col2'}>
					<div className={'github-repo-language'}>
					{this.props.language &&
						<div><span className={`pt-icon-standard pt-icon-full-circle github-language-${this.props.language.toLowerCase()}`} /> {this.props.language}</div>
					}
					</div>
					<div className={'github-repo-stargazers-count'}>
					{(this.props.stargazers_count > 0) &&
						<div><span className="pt-icon-standard pt-icon-star" /> {this.props.stargazers_count}</div>
					}
					</div>
				</div>
			</div>
		);
	}
}

GitHubRepo.propTypes = propTypes;
GitHubRepo.defaultProps = defaultProps;
export default GitHubRepo;
