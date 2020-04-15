import React, { Component } from "react";
import "./vacations-user.css";
import { store } from "../../redux/store";
import { VacationModel } from "../../models/vacation-model";
import { VacationCard } from "../vacation-card/vacation-card";
import { FollowModel } from "../../models/follow-model";
import { UserModel } from "../../models/user-model";
import { ActionType } from "../../redux/actionType";

interface VacationsAdminState {
    vacations: VacationModel[];
    followedVacations: FollowModel[];
    user: UserModel;
}

export class VacationsUser extends Component<any, VacationsAdminState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: [],
            followedVacations: [],
            user: JSON.parse(sessionStorage.getItem("user"))
        };
        // updates view if update occured on server
        store.getState().socket.on("update-from-server", (vacations: VacationModel[]) => {
            if (vacations.length !== undefined) {
                store.dispatch({ type: ActionType.GetVacations, payload: { vacations } })
                this.setState({ vacations: vacations });
                this.getAllVacations(this.state.followedVacations);
            }
        });
    }

    public componentDidMount(): void {
        if (!store.getState().isLoggedIn) {
            alert("Please Login First");
            this.props.history.push("/login");
            return;
        }
        const id = +this.state.user.id;
        fetch("http://localhost:3000/api/follow/byUser/" + id, { headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() }) })
            .then(response => response.json())
            .then(followedVacations => this.getAllVacations(followedVacations))
            .catch(err => alert(err.message));
    }

    private getAllVacations = (followedVacations: FollowModel[]) => {
        //
        if (!JSON.parse(sessionStorage.getItem("vacations"))) {
            fetch("http://localhost:3000/api/vacations", { headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() }) })
                .then(response => response.json())
                .then(vacations => this.reArrangeBasedOnFollowed(vacations, followedVacations))
                .catch(err => alert(err.message));
        }
        const vacations = JSON.parse(sessionStorage.getItem("vacations"));
        this.reArrangeBasedOnFollowed(vacations, followedVacations)
    }

    private updateViewOnChange = (value: boolean) => {
        const id = +this.state.user.id;
        fetch("http://localhost:3000/api/follow/byUser/" + id, { headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() }) })
            .then(response => response.json())
            .then(followedVacations => this.getAllVacations(followedVacations))
            .catch(err => alert(err.message));
    }

    private reArrangeBasedOnFollowed = (vacations: VacationModel[], followedVacations: FollowModel[]) => {
        // checking if followed vacations exist in the vacations array and organizes it by it's order
        if (followedVacations) {
            for (let n = 0; n < followedVacations.length; n++) {
                const indexWhereNumber = vacations.findIndex(x => x.id === followedVacations[n].vacationId);
                if (indexWhereNumber >= 0) {
                    const originalLocation = vacations[n];
                    const changedLocation = vacations[indexWhereNumber];
                    vacations[n] = changedLocation;
                    vacations[indexWhereNumber] = originalLocation;
                }
            }
        }
        this.setState({ vacations: vacations, followedVacations: followedVacations });
    }



    public render(): JSX.Element {
        return (
            <div className="vacations-admin">
                <h2> {this.state.vacations.length} Vacations Available</h2>
                <div className="row">
                    {this.state.vacations.map(p =>
                        <VacationCard
                            key={p.id}
                            userId={this.state.user.id}
                            vacationId={p.id}
                            vacationName={p.vacationName}
                            description={p.description}
                            destination={p.destination}
                            imageFileName={p.imageFileName}
                            startDate={p.startDate}
                            endDate={p.endDate}
                            price={p.price}
                            updateParent={(value) => (value) ? this.updateViewOnChange(value) : ''}
                        />
                    )}
                </div>
            </div>
        );
    }
};

export default VacationsUser;
