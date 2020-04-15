import React, { Component } from "react";
import Menu from "../menu/menu";
import { VacationsAdmin } from "../vacations-admin/vacations-admin";
import "../layout/layout.css";
import { Login } from "../login/login";
import { Logout } from "../logout/logout";
import { Registration } from "../registration/registration";
import { InsertVacationAdmin } from "../insert-vacation-admin/insert-vacation-admin";
import { UpdateVacationAdmin } from "../update-vacation-admin/update-vacation-admin";
import { GraphAdmin } from "../graph-admin/graph-admin";
import { VacationsUser } from "../vacations-user/vacations-user";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";



export class Layout extends Component {
    public render(): JSX.Element {
        return (
            <div className="mainLayout">
                <BrowserRouter>
                    <div className="navDiv">
                        <nav>
                            < Menu />
                        </nav>
                    </div>
                    <div className="mainDiv">
                        <main>
                            <Switch>
                                <Route path="/login" component={Login} exact />
                                <Route path="/logout" component={Logout} exact />
                                <Route path="/registration" component={Registration} exact />
                                <Route path="/vacations" component={VacationsUser} exact />
                                <Route path="/vacations-admin" component={VacationsAdmin} exact />
                                <Route path="/vacations-admin/add" component={InsertVacationAdmin} exact />
                                <Route path="/vacations-admin/:id" component={UpdateVacationAdmin} exact />
                                <Route path="/graph-admin" component={GraphAdmin} exact />
                                <Redirect from="/" to="/vacations" exact />
                            </Switch>
                        </main>
                    </div>
                    <div className="footerDiv">
                        <footer>
                            <p>All Rights Reserved</p>
                        </footer>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}