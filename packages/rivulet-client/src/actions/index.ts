import {createAction,createCheckedAction} from 'redux-helper';

export const addProduct =  createAction<{name:string}> ('ADD_PRODUCT');

export const removeProduct = createAction<string>('REMOVE_PRODUCT');

export const addListItem = createAction<string>('ADD_LISTITEM');

export const removeListItem = createAction<string>('REMOVE_LISTITEM');

export const toggleListItem = createAction<string>('TOGGLE_LISTITEM');

export const dismissError = createAction<void>('DISMISS_ERROR');

export const showError = createAction<string>('SHOW_ERROR');

export const addAsyncProduct = createCheckedAction('ADD_ASYNC_PRODUCT',
    loadAsyncProd,
    (res) => addProduct({name:res})
)


function loadAsyncProd (arg:string) {
    return new Promise <string>((resolve,reject) =>{
        setTimeout(function() {
            resolve(arg);
        }, 100);
    });
} 

