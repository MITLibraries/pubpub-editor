// import { toggleMark, lift, joinUp, selectParentNode, wrapIn, setBlockType } from 'prosemirror-commands';
import { createTable } from 'prosemirror-schema-table';

import { schema } from '../prosemirror-setup';

function getMenuItems(editor, openDialog) {

	/* Horizontal Rule */
	/* -------------- */
	function insertHorizontalRule() {
		editor.view.dispatch(editor.view.state.tr.replaceSelectionWith(schema.nodes.horizontal_rule.create()));
	}

	/* Latex Equation */
	/* -------------- */
	function insertLatexEquation() {
		const newNode = schema.nodes.equation.create({ content: '\\sum_ix^i' });
		editor.view.dispatch(editor.view.state.tr.replaceSelectionWith(newNode));
	}

	/* -------------- */
	/* Table */
	/* -------------- */
	function insertTable() {
		const rows = 2;
		const cols = 2;
		editor.view.dispatch(editor.view.state.tr.replaceSelectionWith(createTable(schema.nodes.table, rows, cols)));
	}

	/* Reference */
	/* -------------- */
	function insertReference(citationObject) {
		editor.view.dispatch(editor.view.state.tr.setMeta('createCitation', citationObject));
	}

	/* Embed */
	/* -------------- */
	function insertEmbed(filename) {
		// const filename = 'test.jpg'; // Should be passed in
		const url = 'http://cdn3-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-5.jpg'; // Should be passed in
		console.log('filename is', filename)
		const textnode = schema.text('Enter caption.');
		const captionNode = schema.nodes.caption.create({}, textnode);
		const embedNode = schema.nodes.embed.create(
			{
				filename,
				align: 'full',
				size: '50%',
			}, 
			captionNode
		);

		let transaction = editor.view.state.tr.replaceSelectionWith(embedNode);
		transaction = transaction.setMeta('uploadedFile', { filename, url });
		editor.view.dispatch(transaction);
	}
	

	const menuItems = [
		{
			icon: 'pt-icon-h1',
			// component: <li>
			// 	<label htmlFor={'upload-media-input'} className="pt-menu-item">
			// 		Upload Media
			// 		<input id={'upload-media-input'} type="file" onChange={onFileSelect} style={{ position: 'fixed', top: '-1000px' }} />
			// 	</label>
			// </li>,
			text: 'Upload Files',
			run: ()=> { openDialog('files', insertEmbed); }, 
		},
		{
			icon: 'pt-icon-h1',
			text: 'Insert Table',
			run: insertTable,
		},
		{
			icon: 'pt-icon-h1',
			text: 'Insert Equation',
			run: insertLatexEquation,
		},
		{
			icon: 'pt-icon-h1',
			text: 'Insert Horizontal Line',
			run: insertHorizontalRule,
		},
		{
			icon: 'pt-icon-h1',
			text: 'Add References',
			run: ()=> { openDialog('references', insertReference); }, 
		},
		
	];


	return menuItems;
}

export default getMenuItems;