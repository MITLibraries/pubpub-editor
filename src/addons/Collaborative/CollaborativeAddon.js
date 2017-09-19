import React, { Component } from 'react';

import FirebasePlugin from './FirebasePlugin';
import PropTypes from 'prop-types';
import { collab } from 'prosemirror-collab';

export const CollaborativeAddon = React.createClass({
	propTypes: {
		containerId: React.PropTypes.string.isRequired,
		view: React.PropTypes.object.isRequired,
		editorState: React.PropTypes.object.isRequired,
		editorRef: React.PropTypes.object.isRequired,
		showCollaborators: React.PropTypes.bool.isRequired,
	},
	statics: {
		getPlugins({ firebaseConfig, clientID, editorKey, getPlugin, key }) {
			// need to add a random client ID number to account for sessions with the same client
			const selfClientID = clientID + Math.round(Math.random() * 10000);
			return [
				FirebasePlugin({ selfClientID, editorKey, firebaseConfig, pluginKey: key, getPlugin }),
				collab({ clientID: selfClientID })
			];
		},
	},
	getInitialState: function() {
		return { collaborators: [] };
	},
	componentWillReceiveProps(nextProps) {
		if (this.props.editorState !== nextProps.editorState) {
			this.onChange(nextProps);
		}
	},
	onChange(props) {
		const { editorState, transaction } = props;
		if (!editorState || !transaction) {
			return null;
		}
		const firebasePlugin = firebaseKey.get(editorState);
		if (firebasePlugin) {
			if (!transaction.getMeta('rebase') ) {
				return firebasePlugin.props.updateCollab(transaction, editorState);
			}
		}
		return null;
	},

	fork(forkID) {
		const { editorState } = this.props;

		let firebasePlugin;
		if (firebasePlugin = firebaseKey.get(editorState)) {
			return firebasePlugin.props.fork.bind(firebasePlugin)(forkID);
		}
		return Promise.resolve(null);
	},

	getForks() {
		const { editorState } = this.props;

		let firebasePlugin;
		if (firebasePlugin = firebaseKey.get(editorState)) {
			return firebasePlugin.props.getForks.bind(firebasePlugin)();
		}
		return Promise.resolve(null);
	},

	render: function() {
		const { top, left } = this.state;
		const { view } = this.props;

		if (!top || !editor || !view ) {
			return null;
		}

		return (
			<div>
			</div>
		);
	}

});

export default CollaborativeAddon;

styles = {
};
