import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {Button,FormControl,Form} from 'react-bootstrap';

export interface InputTextProps {
    onChange: (value:string) =>void,
    defaultText?:string,
    placeholder?:string
}

const InputText = (props:InputTextProps)  =>{
    let input:any;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode == 13 && input.value) {
            e.preventDefault();
            props.onChange(input.value);
            input.value="";
        }
    }

    const onButtonClick = (e:Event) =>{
        if (input.value) {
            props.onChange(input.value);
            input.value="";
        }
    }

    return <div>
            <FormControl  type='text'
            ref = {e=> 
                input = findDOMNode(e)}
            placeholder = {(props.placeholder || '...enter some text') + ' and hit enter'}
            onKeyDown = {handleKeyDown}
            autoFocus = {true}

            />
    </div>
}

export default InputText;
