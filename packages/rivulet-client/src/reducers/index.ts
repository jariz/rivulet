
import * as Redux from 'redux';

import products, {IProductsModel} from './products';
import list, {ListItemModel} from './list';

export interface AppContext {
    store: Redux.Store<IAppState>
}


//Store Model
export interface IAppState {
    products?: IProductsModel;
    list?: ListItemModel[];
}

//Root Reducer
export default Redux.combineReducers<IAppState>({
    products,
    list
});

//Selectors
export const getListItems = (state: IAppState) => {
    return state.list.map(l => {
        const p = state.products.products.filter(p => p.id === l.id)[0];
        return p ? Object.assign({}, p, { checked: l.checked }) : null;
    }).filter(k=>k != null).sort((a,b)=>a.name.localeCompare(b.name));
}

//Export Model Interfaces for action creators.
export {ListItemModel,IProductsModel}