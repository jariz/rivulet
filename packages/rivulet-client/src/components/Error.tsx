import * as React from 'react';
import {Button, Modal, Alert} from 'react-bootstrap';

export interface ErrorProps {
    message?: string,
    onDismiss?: () => void;
}

export const Error = (props: ErrorProps) => {

    const dismiss = () =>{
        if ( props.onDismiss)  props.onDismiss();
    }

    if (props.message) {
        return <Modal.Dialog className="static-modal" style={{padding:0,margin:0}}>
                    <Alert bsStyle="danger" onDismiss={dismiss} style={{margin:0}}>
                        <h4>Error!</h4>
                        <p>{props.message}</p>
                    </Alert>
            </Modal.Dialog>
    }
    return null;
}