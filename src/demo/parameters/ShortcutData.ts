import { WFAction } from "shortcuts3types/built/src/OutputData";
import { ShortcutsActionSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsActionSpec";

type actionDetails = {
	data: WFAction;
	spec: ShortcutsActionSpec | undefined;
	jumpTo: () => void;
};
type Partial<T> = { [key in keyof T]?: T[key] };

export class ShortcutData {
	private _actionUUIDMap: {
		[key: string]: actionDetails;
	};
	constructor() {
		this._actionUUIDMap = {};
	}
	getActionFromUUID(uuid: string): actionDetails | undefined {
		return this._actionUUIDMap[uuid.toLowerCase()];
	}
	setActionForUUID(uuid: string, details: actionDetails) {
		this._actionUUIDMap[uuid.toLowerCase()] = details;
	}
	updateActionForUUID(uuid: string, details: Partial<actionDetails>) {
		console.log("Requested to updateActionForUUID", uuid, details);
		if (!this._actionUUIDMap[uuid.toLowerCase()])
			throw new Error("trying to update action that does not exist");
		Object.assign(this._actionUUIDMap[uuid.toLowerCase()], details);
	}
}
