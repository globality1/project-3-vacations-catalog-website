import React, { Component, ChangeEvent } from "react";
import "./insert-vacation-admin.css";
import { VacationModel } from "../../models/vacation-model";
import axios from "axios";
import { store } from "../../redux/store";
import { Redirect } from "react-router-dom";


interface InsertVacationState {
    vacation: VacationModel[];
    imagePreview: string;
}

export class InsertVacationAdmin extends Component<InsertVacationState, any> {

    private fileInput: HTMLInputElement;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacation: new VacationModel(),
            imagePreview: ""
        };
    };

    public componentDidMount(): void {
        this.checkIfLoggedIn();
    }

    // check if user login but not admin and redirects between the pages occording to permission
    private checkIfLoggedIn = () => {
        if (!store.getState().isLoggedIn) {
            return <Redirect to='/login' />
        }
        if (store.getState().isLoggedIn && store.getState().isAdmin !== 1) {
            this.state.history.push("/vacations")
        }
    }

    private setVacationName = (args: ChangeEvent<HTMLInputElement>) => {
        const vacationName = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.vacationName = vacationName;
        this.setState({ vacation });
    };

    private setDescription = (args: ChangeEvent<HTMLInputElement>) => {
        const description = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.description = description;
        this.setState({ vacation });
    };

    private setDestination = (args: ChangeEvent<HTMLInputElement>) => {
        const destination = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.destination = destination;
        this.setState({ vacation });
    };

    private setPicFileName = (args: ChangeEvent<HTMLInputElement>) => {
        const imageFile = args.target.files[0];
        const vacation = { ...this.state.vacation };
        vacation.imageFile = imageFile;
        this.setState({ vacation });

        const reader = new FileReader();
        reader.onload = event => this.setState({ imagePreview: event.target.result.toString() });
        reader.readAsDataURL(imageFile);
    };

    private setStartDate = (args: ChangeEvent<HTMLInputElement>) => {
        const startDate = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.startDate = startDate;
        this.setState({ vacation });
    };

    private setEndDate = (args: ChangeEvent<HTMLInputElement>) => {
        const endDate = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.endDate = endDate;
        this.setState({ vacation });
    };

    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        const price = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.price = price;
        this.setState({ vacation });
    };

    private addVacation = async () => {
        const newForm = new FormData();
        newForm.append("vacationName", this.state.vacation.vacationName);
        newForm.append("destination", this.state.vacation.destination);
        newForm.append("description", this.state.vacation.description);
        newForm.append("imageFile", this.state.vacation.imageFile, this.state.vacation.imageFile.name);
        newForm.append("startDate", this.state.vacation.startDate.toString());
        newForm.append("endDate", this.state.vacation.endDate.toString());
        newForm.append("price", this.state.vacation.price.toString());
        const response = await axios.post<VacationModel>("http://localhost:3000/api/vacations", newForm, { headers: { 'authorization': 'Bearer ' + store.getState().token.toString() } });
        const vacation = response.data;
        if (vacation) {
            alert(`Vacation ID ${vacation.id} Has Been Added`);
            store.getState().socket.emit("update-from-admin", 'vacation-added');
            this.cleanFields()
        }

    };

    private cleanFields = () => {
        this.setState({vacation: new VacationModel(null,'','','',null,'','','',0), imagePreview: ''});
    }


    public render(): JSX.Element {
        return (
            <div className="insert">
                <h2>Add New Vacation</h2>
                <form>
                    <input type="text" placeholder="Vacation Name..." onChange={this.setVacationName} value={this.state.vacation.vacationName} /> <br />
                    <input type="text" placeholder="Vacation Description..." onChange={this.setDescription} value={this.state.vacation.description} /> <br />
                    <input type="text" placeholder="Vacation Destination..." onChange={this.setDestination} value={this.state.vacation.destination} /> <br />
                    <input type="date" placeholder="Vacation End Date..." onChange={this.setStartDate} value={this.state.vacation.startDate} /> <br />
                    <input type="date" placeholder="Vacation Start Date..." onChange={this.setEndDate} value={this.state.vacation.endDate} /> <br />
                    <input type="file" accept="image/*" onChange={this.setPicFileName}/> <br />
                    <img className="imagePreview" src={this.state.imagePreview} width={200} alt={""}/><br />
                    <input type="number" placeholder="Vacation Price..." onChange={this.setPrice} value={this.state.vacation.price} /> <br />
                    <button type="button" onClick={this.addVacation}>Add New Vacation</button>
                </form >
            </div>
        );
    };
};

export default InsertVacationAdmin;
