import React, { Component } from 'react';
import GitHubEditable from './GitHubEditable';
import GitHubStatic from './GitHubStatic';

const propTypes = {
};
const defaultProps = {
};

/**
* @module Addons
*/

/**
* @component
*
* Embed GitHub repo in your document.
*
*/
class GitHub extends Component {
	static schema = ()=> {
		return {
			nodes: {
				github: {
					atom: true,
					attrs: {
						repo: { default: null }
					},
					inline: false,
					group: 'block',
					draggable: false,
					selectable: true,
					insertMenu: {
						label: 'Insert GitHub Link',
						icon: 'pt-icon-git-repo',
						onInsert: (view) => {
							const githubNode = view.state.schema.nodes.github.create();
							const transaction = view.state.tr.replaceSelectionWith(githubNode);
							view.dispatch(transaction);
						},
					},
					toEditable(node, view, decorations, isSelected, helperFunctions) {
						return (
							<GitHubEditable
								repo={node.attrs.repo}
								isSelected={isSelected}
								{...helperFunctions}
							/>
						);
					},
					toStatic(node) {
						return (
							<GitHubStatic
								url={node.attrs.url}
							/>
						);
					},
				},
			}
		};
	};

	render() {
		return null;
	}
}

GitHub.propTypes = propTypes;
GitHub.defaultProps = defaultProps;
export default GitHub;
