import React, { Component } from "react";
import "./logout.css";
import axios from "axios";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";

export class Logout extends Component<any> {

    public constructor(props: any) {
        super(props);
    }

    public async componentDidMount() {
        try {
            await axios.post("http://localhost:3000/api/auth/logout", null, { withCredentials: true }); // { withCredentials: true } causes the cookie to be sent to server.
            store.getState().socket.disconnect();
            store.dispatch({ type: ActionType.Logout });
            this.props.history.push("/login");
        }
        catch (err) {
            alert(err.response ? err.response.data : err.message);
        }
    }

    public render() {
        return (
            <div className="logout"></div>
        );
    }

}