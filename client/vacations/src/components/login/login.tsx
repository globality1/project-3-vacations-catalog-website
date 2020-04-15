import React, { Component, ChangeEvent } from "react";
import "./login.css";
import axios from "axios";
import { CredentialsModel } from "../../models/credentials-model";
import { UserModel } from "../../models/user-model";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { NavLink } from "react-router-dom";
import { VacationModel } from "../../models/vacation-model";
import io from "socket.io-client";


interface LoginState {
    credentials: CredentialsModel;
    loginError: string;
}

export class Login extends Component<any, LoginState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            credentials: new CredentialsModel(),
            loginError: ""
        };
    }


    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        const credentials = { ...this.state.credentials };
        credentials.username = username;
        this.setState({ credentials });
    }

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        const credentials = { ...this.state.credentials };
        credentials.password = password;
        this.setState({ credentials });
    }

    private login = async () => {
        if(this.validateLoginFields()) {
        try {
            const response = await axios.post<UserModel>("http://localhost:3000/api/auth/login", this.state.credentials, { withCredentials: true });
            const user = response.data;
            if(user) {
            store.dispatch({ type: ActionType.Login, payload: {user}});
            store.getState().socket.emit("update-from-admin", 'AAA');
            store.getState().socket.on("update-from-server", (vacations:VacationModel[]) => {
                if(vacations.length !== 0 )
                store.dispatch({ type: ActionType.GetVacations, payload:{ vacations}})
            });
            this.props.history.push("/vacations");
            }
        }
        catch (err) {
            alert(err.response ? err.response.data : err.message);
        }
    }
    }

    private validateLoginFields = () => {
      if(!this.state.credentials.password) {
          alert("Username or Password Can't be empty");
          return false; 
      }
      return true;
    }

    public render() {
        return (
            <div className="login">

                <h2>Login</h2>
                <div>{this.state.loginError}</div>
                <input type="text" onChange={this.setUsername} value={this.state.credentials.username || ""} placeholder="Username..." autoComplete={"on"}/>
                <br /><br />
                <input type="password" onChange={this.setPassword} value={this.state.credentials.password || ""} placeholder="Password..." autoComplete={"on"}/>
                <br /><br />
                <button type="button" onClick={this.login}>Login</button>
                <br />
                <div>Don't have a user? <NavLink to="/registration">Register</NavLink></div>
            </div>
        );
    }
}