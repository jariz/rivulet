import * as React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button} from 'react-bootstrap';
import {Link, withRouter, IRouter} from 'react-router';
let logo = require('../../logo.svg');

const menu = [
  {to:'/',label:'HOME'},
  {to:'products',label:'Products'},
  {to:'list',label:'Current List'},
];

const App = (props) => {
  return <div>
    <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <img src={logo}/>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Nav>
        <NavLinks menu={menu} manageActive={true}/>
      </Nav>
      <Navbar.Collapse>
      </Navbar.Collapse>
    </Navbar>
    {props.children}
  </div>
}

export default App;


// NAVLinks, wrap navbar item and router links and manage active state.

class UnlinkedNavLink extends React.Component<{ menu: {to: string, label: string}[], router?: IRouter, manageActive?:boolean }, { active: number }>{
  constructor(props) {
    super(props);
    this.state = { active:null };
  }
  private onClickHandler = (i:number,to: string) => {
    this.props.router.push(to);
    this.setState({
      active:i
    });
  }

  render() {
    return <Nav>
      {
        this.props.menu.map((m,i)=>{
          return <NavItem key={i} active={i==this.state.active && this.props.manageActive} onSelect={this.onClickHandler.bind(null, i,m.to) }>{m.label}</NavItem>;
        })
      }
    </Nav>
  }
}

const NavLinks = withRouter(UnlinkedNavLink);

