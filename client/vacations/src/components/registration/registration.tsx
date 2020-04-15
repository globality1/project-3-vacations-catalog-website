import React, { Component, ChangeEvent } from "react";
import "./registration.css";
import { UserModel } from "../../models/user-model";
import axios from "axios";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { CredentialsModel } from "../../models/credentials-model";
import { NavLink, Redirect } from "react-router-dom";

interface RegistrationState {
    user: UserModel[];
}

export class Registration extends Component<RegistrationState, any> {

    public constructor(props: any) {
        super(props);
        this.state = {
            user: new UserModel(),
            credentials: new CredentialsModel(),
                firstNameError: "",
                lastNameError: "",
                passwordError: "",
                usernameError: "",
        };
    };

    public componentDidMount(): void {
        this.checkIfLoggedIn();
    }

    private checkIfLoggedIn = () => {
        if (store.getState().isLoggedIn) {
            return <Redirect to='/vacations' />
        }
    }
    // update first name field
    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        const user = { ...this.state.user };
        user.firstName = firstName;
        this.setState({ user });
    };
    // update last name field
    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        const user = { ...this.state.user };
        user.lastName = lastName;
        this.setState({ user });
    };
    // update last name field
    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        const user = { ...this.state.user };
        user.username = username;
        this.setState({ user });
        const credentials = { ...this.state.credentials };
        credentials.username = username;
        this.setState({ credentials });
    };
    // update last name field
    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        const user = { ...this.state.user };
        user.password = password;
        this.setState({ user });
        const credentials = { ...this.state.credentials };
        credentials.password = password;
        this.setState({ credentials });
    };

    private validateFormFields = () => {
        let firstNameError = "";
        let lastNameError = "";
        let passwordError = "";
        let usernameError = "";
        if (!this.state.user.firstName) {
            firstNameError = "First Name Can't be Empty"
        }
        if (!this.state.user.lastName) {
            lastNameError = "Last Name Can't be Empty"
        }
        if (!this.state.user.username) {
            usernameError = "Username Name Can't be Empty"
        }
        if (!this.state.user.password) {
            passwordError = "Password Name Can't be Empty"
        }
        if (this.state.user.firstName && this.state.user.firstName.length < 1) {
            firstNameError = "First Name Must be at least 1 character long"
        }
        if (this.state.user.lastName && this.state.user.lastName.length < 1) {
            lastNameError = "Last Name Must be at least 1 character long"
        }
        if (this.state.user.username && this.state.user.username.length < 4) {
            usernameError = "Username must be at least 4 characters long"
        }
        if (this.state.user.password && this.state.user.password.length < 6) {
            passwordError = "Name Must be at least 6 characters long"
        }
        if (this.state.user.firstName && this.state.user.firstName.length > 12) {
            firstNameError = "First Name Can't be more than 12 characters long"
        }
        if (this.state.user.lastName && this.state.user.lastName.length > 12) {
            lastNameError = "Last Name Can't be more than 12 characters long"
        }
        if (this.state.user.username && this.state.user.username.length > 12) {
            usernameError = "Username Can't be more than 12 characters long"
        }
        if (this.state.user.password && this.state.user.password.length > 15) {
            passwordError = "Password Can't be more than 15 characters long"
        }

        if (firstNameError || lastNameError || usernameError || passwordError) {
            this.setState({firstNameError:firstNameError,lastNameError:lastNameError,usernameError:usernameError, passwordError:passwordError})
            return false;
        }
        return true;


    }
    // create user function
    private addUser = async () => {
        if (this.validateFormFields()) {
            try {
                const newForm = new FormData();
                newForm.append("firstName", this.state.user.firstName);
                newForm.append("lastName", this.state.user.lastName);
                newForm.append("username", this.state.user.username);
                newForm.append("password", this.state.user.password);
                const response = await axios.post<UserModel>("http://localhost:3000/api/users", newForm);
                const user = response.data;
                if (user) {
                    this.login();
                }
            }
            catch (err) {
                alert(err.response ? err.response.data : err.message);
            }
        }
    };
    // login function
    private login = async () => {
        try {
            const response = await axios.post<UserModel>("http://localhost:3000/api/auth/login", this.state.credentials, { withCredentials: true }); // { withCredentials: true } causes the cookie to be sent to server.
            const user = response.data;
            store.dispatch({ type: ActionType.Login, payload: user });
            if (store.getState().isLoggedIn) {
                this.context.router.push("/vacations");
                return;
            }
        }
        catch (err) {
            alert(err.response ? err.response.data : err.message);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="registration">
                <h2>Register Now</h2>
                <form>
                    <div className="errorFormAlert">{this.state.firstNameError}</div>
                    <input type="text" placeholder="First Name..." onChange={this.setFirstName} value={this.state.user.firstName} autoComplete={"on"} />  {!this.state.user.firstName && "*"}
                    <br />
                    {!this.state.lastNameError && <br />}
                    <div className="errorFormAlert">{this.state.lastNameError}</div>
                    <input type="text" placeholder="Last Name..." onChange={this.setLastName} value={this.state.user.lastName} autoComplete={"on"} /> {!this.state.user.lastName && "*"}
                    <br />
                    {!this.state.usernameError && <br />}
                    <div className="errorFormAlert">{this.state.usernameError}</div>
                    <input type="text" placeholder="Username" onChange={this.setUsername} value={this.state.user.username} autoComplete={"on"} /> {!this.state.user.username && "*"}
                    <br />
                    {!this.state.passwordError && <br />}
                    <div className="errorFormAlert">{this.state.passwordError}</div>
                    <input type="password" placeholder="Password" onChange={this.setPassword} value={this.state.user.password} autoComplete={"on"} /> {!this.state.user.password && "*"}
                    <br />
                    <br />
                    <button type="button" onClick={this.addUser}>Register</button>
                    <br />
                    <div>Already Registered? <NavLink to="/login">Click Here</NavLink></div>
                </form>
            </div>
        );
    };
};

export default Registration;