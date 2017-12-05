import {createStore, applyMiddleware, compose, Store, Dispatch} from 'redux';
import root, {IAppState} from './reducers';
import thunk from 'redux-thunk';
import {checkedPromiseMiddleware,CheckedPromiseMiddlewareOptions} from 'redux-helper';
import * as actions from './actions';

const opts :CheckedPromiseMiddlewareOptions = {
    onStart: (msg:string) =>({type:'LOAD_MESSAGE',message:msg}),
    onEnd: () =>({type:'LOAD_MESSAGE',message:''}),
    onError: (msg:string) =>actions.showError(msg)
}

const cpm = checkedPromiseMiddleware(opts);

function configureStore(): Store<IAppState> {
    const debugEnhancer = (window as any).devToolsExtension && (window as any).devToolsExtension();
 
    const middlewares: ((store: Store<IAppState>) =>
        (dispatch: Dispatch<IAppState>) =>
            <A>(action: A) => A)[] = [cpm, thunk];

    const enhancers: any = compose(applyMiddleware(...middlewares));
    return createStore<IAppState>(root, enhancers);
}

export default configureStore;