import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import * as Actions from '../../actions';
import {getListItems, IProductsModel, IAppState} from '../../reducers'
import {Grid, ListGroup, ListGroupItem, Glyphicon, Button, DropdownButton, MenuItem} from 'react-bootstrap';


export interface ListItemProps {
    items?: { id: string, name: string, checked: boolean }[];
    products?: IProductsModel;
    dispatch?: Redux.Dispatch<any>;
}

const ListItems: React.StatelessComponent<ListItemProps> = (props) => {

    const unselectedProducts = props.products.products.filter(p=>props.items.map(p=>p.id).indexOf(p.id) < 0);

    const addItem = (eventKey:number, event) => {
        props.dispatch(Actions.addListItem(unselectedProducts[eventKey].id));
        console.log(eventKey,event);
    }

    return <Grid>
        <h2>Current List</h2>
        <ListGroup>
            {props.items.map((p, i) => {
                return <ListGroupItem key={i}>
                    <span className={p.checked && 'checked'} style={{ cursor: 'pointer' }} onClick= { _ => { props.dispatch(Actions.toggleListItem(p.id)) } }>{p.name}</span>
                    <Button className='badge' onClick= {_ => { props.dispatch(Actions.removeListItem(p.id)) } }>
                        <Glyphicon glyph='trash'/>
                    </Button>
                </ListGroupItem>
            }) }
        </ListGroup>
        { unselectedProducts.length > 0 &&
            <DropdownButton onSelect={addItem} bsSize="small" title="..select a product" id="dropdown-size-large">
                {
                    unselectedProducts.map((p, i) => <MenuItem key={i} eventKey={i}> {p.name} </MenuItem>)
                }
            </DropdownButton>
        }
    </Grid>
}

const mapStateToProps = (s: IAppState) => {
    return {
        items: getListItems(s),
        products: s.products
    }
};

export default connect(mapStateToProps)(ListItems);
