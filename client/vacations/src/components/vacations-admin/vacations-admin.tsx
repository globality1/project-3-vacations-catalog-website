import React, { Component } from "react";
import "./vacations-admin.css";
import { store } from "../../redux/store";
import { VacationModel } from "../../models/vacation-model";
import { NavLink, Redirect } from "react-router-dom";
import { ActionType } from "../../redux/actionType";


interface VacationsAdminState {
    vacations: VacationModel[];
}

export class VacationsAdmin extends Component<any, VacationsAdminState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: []
        };
        // updates view if update occured on server
        store.getState().socket.on("update-from-server", (vacations: VacationModel[]) => {
            if (vacations.length !== undefined) {
                store.dispatch({ type: ActionType.GetVacations, payload: { vacations } });
                this.setState({vacations:vacations});
            }
        });
    }

    public componentDidMount(): void {
        this.checkIfLoggedIn();
        fetch("http://localhost:3000/api/vacations", { headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() }) })
            .then(response => response.json())
            .then(vacations => this.setState({ vacations }))
            .catch(err => alert(err.message))

    }

    private checkIfLoggedIn = () => {
        if (!store.getState().isLoggedIn) {
            return <Redirect to='/login' />
        }
        if (store.getState().isLoggedIn && store.getState().isAdmin !== 1) {
            this.props.history.push("/vacations")
        }
    }

    private deleteVacation = (id: number) => {

        const answer = window.confirm("Are you sure you want to delete this vacation?");
        if (!answer) {
            return;
        }
        const options = {
            method: "DELETE",
            headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() })
        };

        fetch("http://localhost:3000/api/vacations/" + id, options)
            .then(() => {
                store.getState().socket.emit("update-from-admin", 'vacation-added');
                alert("Vacation has been deleted");
                this.props.history.push("/vacations-admin");
                return;
            })
            .catch(err => alert(err.message));
    };



    public render(): JSX.Element {
        return (
            <div className="vacations-admin">
                <h2> {this.state.vacations.length} Vacations</h2>
                <h3> <NavLink to="/vacations-admin/add">Add New Vacation</NavLink></h3>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Destination</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Picture</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.vacations.map(p =>
                            <tr key={p.id}>
                                <td>
                                    <NavLink to={"/vacations-admin/" + p.id}>{p.id}</NavLink>
                                </td>
                                <td>{p.price}</td>
                                <td>{p.destination}</td>
                                <td>{p.description}</td>
                                <td>{p.startDate}</td>
                                <td>{p.endDate}</td>
                                <td><img className="adminImage" src={"http://localhost:3000/api/uploads/" + p.imageFileName} alt={""}></img></td>
                                <td>
                                    <NavLink to={"/vacations-admin/" + p.id}>Edit</NavLink>
                                </td>
                                <td>
                                    <a href="javascript:void" onClick={() => this.deleteVacation(p.id)}>Delete</a>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default VacationsAdmin;
