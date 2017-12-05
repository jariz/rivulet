
import * as actions from '../actions';
import {Action} from 'redux-helper';

const reducer = (state: ListItemModel[] = [], action: Action<any>) => {
    if (actions.addListItem.matchAction(action)) {
        return state.filter(p => p.id !== action.payload).concat([{ id: action.payload, checked: false }]);

    } else if (actions.removeListItem.matchAction(action)) {
        return state.filter(p => p.id !== action.payload);

    } else if (actions.toggleListItem.matchAction(action)) {
        const item = state.filter(p => p.id == action.payload)[0];
        if (item) {
            return state.filter(p => p.id !== action.payload).concat(Object.assign(item, { checked: !item.checked }));
        } else {
            return state;
        }
    }
    return state;
}


export default reducer;

export interface ListItemModel {
    id: string;
    checked: boolean;
}


