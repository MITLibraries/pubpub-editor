import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/labs';
import GitHubRepo from './GitHubRepo';

require('./gitHub.scss');

const propTypes = {
	repo: PropTypes.object,

	isSelected: PropTypes.bool,
	updateAttrs: PropTypes.func.isRequired,
	deselectNode: PropTypes.func.isRequired
};

const defaultProps = {
	repo: null,

	isSelected: false
};

class GitHubEditable extends Component {
	static cleanSearchText(searchText) {
		// remove beginning/ending whitespace
		let cleanedSearchText = searchText.trim();

		// remove remaining multiple whitespaces
		cleanedSearchText = cleanedSearchText.replace(/\s+/g, ' ');

		return cleanedSearchText;
	}

	constructor(props) {
		super(props);

		this.state = {
			repoList: [],
			searchText: ''
		};

		this.handleRepoSelect = this.handleRepoSelect.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.searchGitHub = this.searchGitHub.bind(this);

		this.typeAhead = null;
	}

	handleRepoSelect(repo) {
		this.props.updateAttrs({
			repo: repo
		});

		this.props.deselectNode();
	}

	handleValueChange(evt) {
		this.setState({ searchText: evt.target.value });

		clearTimeout(this.typeAhead);

		this.typeAhead = setTimeout(() => {
			this.searchGitHub();
		}, 500);
	}

	searchGitHub() {
		const searchText = GitHubEditable.cleanSearchText(this.state.searchText);

		if (searchText === '') {
			return;
		}

		window.fetch(`https://api.github.com/search/repositories?q=${this.state.searchText}`).then((response) => {
			if (response.ok) {
				return response.json();
			}

			throw new Error('error fetching from GitHub');
		}).then((responseJSON) => {
			this.setState({ repoList: responseJSON.items });
		}).catch((error) => {
			// console.log('ERROR');
			// console.log(error);
		});
	}

	render() {
		return (
			<div className="github-wrapper" ref={(rootElem)=> { this.rootElem = rootElem; }}>
				<div className={`github-edit ${this.props.isSelected ? 'isSelected' : ''}`}>
					{!this.props.repo && !this.props.isSelected &&
						<div>CLICK TO INSERT GITHUB REPO INTO DOCUMENT</div>
					}
					{this.props.repo &&
						<GitHubRepo
							description={this.props.repo.description}
							full_name={this.props.repo.full_name}
							html_url={this.props.repo.html_url}
							language={this.props.repo.language}
							stargazers_count={this.props.repo.stargazers_count}
							updated_at={this.props.repo.updated_at}
						/>
					}
					{this.props.isSelected &&
						<Suggest
							className={'github-edit-input'}
							items={this.state.repoList}
							inputProps={{
								value: this.state.searchText,
								onChange: this.handleValueChange,
								placeholder: 'Enter GitHub repo name or url to search for',
								className: 'pt-large',
								size: 50
							}}
							inputValueRenderer={(repoList) => { return repoList.full_name; }}
							itemRenderer={({ item, handleClick, isActive })=> {
								return (
									<li key={item.id}>
										<span role={'button'} tabIndex={-1} onClick={handleClick} className={isActive ? 'pt-menu-item pt-active' : 'pt-menu-item'}>
											<GitHubRepo
												description={item.description}
												full_name={item.full_name}
												html_url={item.html_url}
												language={item.language}
												stargazers_count={item.stargazers_count}
												updated_at={item.updated_at}
											/>
										</span>
									</li>
								);
							}}
							onItemSelect={this.handleRepoSelect}
							noResults={<MenuItem disabled text="No results" />}
							popoverProps={{ popoverClassName: 'pt-minimal user-autocomplete-popover' }}
						/>
					}
				</div>
			</div>
		);
	}
}

GitHubEditable.propTypes = propTypes;
GitHubEditable.defaultProps = defaultProps;
export default GitHubEditable;
