import {Field, Model, normalizeModel, TreeModel} from "./model";
import {Node} from "./cms";
import { RouterState } from 'react-router-redux';

export default interface AppState {
	main: Main;
	editingField: any;
	editingNode: any;
	message: Message;
	navigation;
	confirm;
	router: RouterState;
	field?: any;
	modelNode?: any;
	forms?: any;
}

export const makeAppState = (model, data) : AppState => {
	return {
		main: makeMain(model ,data),
		editingField: null,
		editingNode: null,
		message: {
			text: ''
		},
		navigation: { latestNode : '' },
		confirm: null,
		router: {}
	}
};

export interface Message {
	text: string;
}

export interface FieldInError {
	name: string;
	value: any;
}

export interface Main {
	tree: Node<TreeModel>;
	stale: boolean;
	busy: boolean;
	path: string | null;
	fieldsInError: Map<string, FieldInError>;
}

export const makeMain = (model?, data?) : Main => {
	let treeModel = model ? (<TreeModel> normalizeModel(model)) : { name: 'New Web Site', children: [], fields: [] };
	return {
		tree: {
			model: treeModel,
			data: data || {},
			parent: null,
			path: '',
			treePath: '',
			fieldIndex: -1,
			dataIndex: -1
		},
		stale: false,
		busy: false,
		path: '',
		fieldsInError: new Map()
	} as Main;
};

export const cloneMain = (main: Main) : Main => {
	const _fieldsInError : Map<string, FieldInError> = new Map();
	main.fieldsInError.forEach((fieldInError, key) => {
		_fieldsInError.set(key, { name: fieldInError.name, value: fieldInError.value });
	});
	return {
		tree: {
			model: (<TreeModel> normalizeModel(JSON.parse(JSON.stringify(main.tree.model)))),
			data: JSON.parse(JSON.stringify(main.tree.data)),
			parent: null,
			path: '',
			treePath: '',
			fieldIndex: -1,
			dataIndex: -1
		},
		stale: main.stale,
		busy: main.busy,
		path: main.path,
		fieldsInError: _fieldsInError
	};
};