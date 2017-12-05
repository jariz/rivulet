
import * as actions from '../actions';
import {Action} from 'redux-helper';

let productCounter = 0;

const defaultState: IProductsModel = {
    products: []
}

const reducer = (state: IProductsModel = defaultState, action: Action<any>) => {

    if (actions.addProduct.matchAction(action)) {
        if (state.products.filter(p => p.name == action.payload.name).length > 0) {
            return {
                products: state.products,
                error: `Product ${action.payload.name} already exist`
            }
        } else {
            
            return {
                products: state.products.concat( {
                    id:(++productCounter).toString(),
                    name: action.payload.name
                })
            }
        }

    } else if (actions.removeProduct.matchAction(action)) {
        return {
            products: state.products.filter(p => p.id !== action.payload)
        }

    } else if (actions.dismissError.matchAction(action)) {
        return {
            products: state.products
        }
    }
    
    return state;
}

export default reducer;

interface Product {
    id: string;
    name: string;
}

export interface IProductsModel {
    products: Product[],
    error?: string
}