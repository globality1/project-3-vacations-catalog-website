import React, { Component } from "react";
import "./menu.css";
import { NavLink } from "react-router-dom";
import { store } from "../../redux/store";
import { UserModel } from "../../models/user-model";
import { Unsubscribe } from "redux";

interface MenuState {
    isLoggedIn: boolean;
    user: UserModel;
    isAdmin: number;
}

export class Menu extends Component<any, MenuState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isLoggedIn: store.getState().isLoggedIn,
            isAdmin: store.getState().isAdmin,
            user: store.getState().user
        };
    }

    public componentDidMount(): void {
        this.unsubscribeStore = store.subscribe(() => this.setState({
            isLoggedIn: store.getState().isLoggedIn,
            isAdmin: store.getState().isAdmin,
            user: store.getState().user
        }));
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public render(): JSX.Element {
        return (
            <div className="menu row">
                {this.state.isLoggedIn && <NavLink to="/vacations" className="menuSelection col-sm-1" activeClassName="active" exact>Vacations</NavLink>}
                {this.state.isLoggedIn && this.state.isAdmin === 1 && <span> | </span>}
                {this.state.isLoggedIn && this.state.isAdmin === 1 && <NavLink to="/vacations-admin" className="menuSelection col-sm-1" activeClassName="active" exact>Inventory</NavLink>}
                {this.state.isLoggedIn && this.state.isAdmin === 1 && <span> | </span>}
                {this.state.isLoggedIn && this.state.isAdmin === 1 && <NavLink to="/graph-admin" className="menuSelection col-sm-1" activeClassName="active" exact>Graph</NavLink>}
                {this.state.isLoggedIn && this.state.isAdmin === 1 && <span> | </span>}
                {this.state.isLoggedIn && this.state.isAdmin === 1 && <div className="spacingDiv col-sm-1 col-md-4"></div>}
                {this.state.isLoggedIn && this.state.isAdmin !== 1 && <div className="spacingDiv col-sm-7"></div>}
                {!this.state.isLoggedIn && <div className="spacingDiv col-sm-11"></div>}
                {this.state.isLoggedIn && <span className="welcomeMessage col-sm-1">{this.state.user.firstName} </span>}
                {this.state.isLoggedIn && <span> | </span>}
                {this.state.isLoggedIn && <NavLink to="/logout" className="logout menuSelection col-sm-1" activeClassName="active" exact>Logout</NavLink>}
            </div>
        );
    }
}

export default Menu;