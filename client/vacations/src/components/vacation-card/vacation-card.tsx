import React, { Component, ChangeEvent } from "react";
import "./vacation-card.css";
import { store } from "../../redux/store";
import axios from "axios";
import { FollowModel } from "../../models/follow-model";
import { Redirect } from "react-router-dom";

interface VacationCardProps {
    vacationId: number;
    vacationName: string;
    description: string;
    destination: string;
    imageFileName: string;
    startDate: string;
    endDate: string;
    price: number;
    userId: number;
    updateParent?(stateOfRefresh: boolean): void;
}

interface VacationCardState {
    checkedValue: boolean;
    followedVacations: FollowModel[];
}

export class VacationCard extends Component<VacationCardProps, VacationCardState> {

    private followedArrayToCheck: Array<FollowModel>;
    private checkedStateAfterCheck: boolean;

    public constructor(props: any) {
        super(props);
        this.state = {
            checkedValue: this.checkedStateAfterCheck,
            followedVacations: [],
        };
    };

    public componentDidMount(): void {
        this.checkIfLoggedIn();
        const id = +this.props.userId;
        fetch("http://localhost:3000/api/follow/byUser/" + id, { headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() }) })
            .then(response => response.json())
            .then(followedVacations => this.getAllVacations(followedVacations))
            .catch(err => alert(err.message));
    }

    private checkIfLoggedIn = () => {
        if (!store.getState().isLoggedIn) {
            return <Redirect to='/login' />
        }
    }

    private getAllVacations = (followedVacations: FollowModel[]) => {
        this.setState({ followedVacations: followedVacations });
        this.followedArrayToCheck = followedVacations;
        this.markIfFollowed(this.followedArrayToCheck);
    }

    private markIfFollowed = (toCheck: FollowModel[]) => {
        const newFollowedVacations = Object.values(toCheck);
        const index = newFollowedVacations.findIndex(x => x.vacationId === this.props.vacationId);
        if (index > -1) {
            this.setState({ checkedValue: true });
        }
    }

    private followAction = (args: ChangeEvent<HTMLInputElement>) => {
        const checkIfChecked = args.target.checked;
        const vacationIdName = args.target.name;
        const vacationNumber = Number(vacationIdName.substring(1));
        this.setState({ checkedValue: checkIfChecked });
        (checkIfChecked) ? this.addFollow(vacationNumber) : this.removeFollow(vacationNumber);
    }

    private addFollow = async (vacationNumber: number) => {
        const newForm = new FormData();
        newForm.append("userId", this.props.userId.toString());
        newForm.append("vacationId", vacationNumber.toString());
        const response = await axios.post<FollowModel>("http://localhost:3000/api/follow", newForm, { headers: { 'authorization': 'Bearer ' + store.getState().token.toString() } });
        if (response) {
            const followVacation = response.data;
            const vacationToAdd = { 'id': followVacation.id, 'userId': this.props.userId, 'vacationId': vacationNumber };
            this.setState({ followedVacations: [...this.state.followedVacations, vacationToAdd] })
            alert("Vacation " + vacationNumber + " added to follow array for user " + this.props.userId + " New Follow Added " + followVacation.id);
            this.props.updateParent(true);
        }
    }

    private removeFollow = async (vacationNumber: number) => {
        const newForm = new FormData();
        newForm.append("userId", this.props.userId.toString());
        newForm.append("vacationId", vacationNumber.toString());
        const response = await axios.delete<FollowModel>("http://localhost:3000/api/follow", { headers: { 'Content-Type': 'application/json','authorization': 'Bearer ' + store.getState().token.toString()}, data: newForm });
        if (response) {
            const newFollowedVacations = Object.values(this.state.followedVacations);
            console.log("newFollowedVacations");
            console.log(newFollowedVacations);
            const index = newFollowedVacations.findIndex(x => x.vacationId === vacationNumber);
            newFollowedVacations.splice(index, 1);
            this.setState({ followedVacations: newFollowedVacations });
            alert("Vacation " + vacationNumber + " removed from follow array for user " + this.props.userId);
            this.props.updateParent(true);
        }
    }

    public render(): JSX.Element {
        return (
            <div key={this.props.vacationId} className="vacationCard" id={"vacationCard" + this.props.vacationId}>
                {!this.state.checkedValue && <p className="followVacationText">Follow Vacation</p>}
                {this.state.checkedValue && <p className="unfollowVacationText">Unfollow Vacation</p>}
                <input type="checkbox" checked={this.state.checkedValue || false} onChange={this.followAction} name={"i" + this.props.vacationId} id={"follow" + this.props.vacationId}></input>
                <img src={"http://localhost:3000/api/uploads/" + this.props.imageFileName} width={150} height={150} alt={""} /><br />
                <h2>{this.props.vacationName}</h2>
                <div className="vacationDepart">Depart: {this.props.startDate} </div>
                <div className="vacationReturn">Return: {this.props.endDate} </div>
                <div className="vacationDestination">{this.props.destination}</div>
                <div className="vacationPrice">Price: {this.props.price}</div>
                <div className="vacationDescription">{this.props.description}</div>
            </div>
        );
    }

}
