import React, { Component, ChangeEvent } from "react";
import "./update-vacation-admin.css";
import { VacationModel } from "../../models/vacation-model";
import { store } from "../../redux/store";
import axios from "axios";
import { Redirect } from "react-router-dom";

interface UpdateVacationState {
    vacation: VacationModel;
    imagePreview: string;
}

export class UpdateVacationAdmin extends Component<any, UpdateVacationState> {

    private fileInput: HTMLInputElement;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacation: new VacationModel(),
            imagePreview: ""
        };
    };

    public componentWillMount(): void {
        this.checkIfLoggedIn()
        const id = +this.props.match.params.id;
        fetch("http://localhost:3000/api/vacations/" + id,{ headers: { 'authorization': 'Bearer ' + store.getState().token.toString() } })
            .then(response => response.json())
            .then(vacation => this.setState({ vacation }))
            .catch(err => alert(err.message));
    }

    private checkIfLoggedIn = () => {
        if (!store.getState().isLoggedIn) {
            return <Redirect to='/login' />
        }
        if (store.getState().isLoggedIn && store.getState().isAdmin !== 1) {
            this.props.history.push("/vacations")
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
        vacation.startDate = startDate.slice(0, 10);
        this.setState({ vacation });
    };

    private setEndDate = (args: ChangeEvent<HTMLInputElement>) => {
        const endDate = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.endDate = endDate.slice(0, 10);
        this.setState({ vacation });
    };

    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        const price = +args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.price = price;
        this.setState({ vacation });
    };

    private updateVacation = async () => {
        const id = +this.props.match.params.id;
        const newForm = new FormData();
        newForm.append("vacationName", this.state.vacation.vacationName);
        newForm.append("destination", this.state.vacation.destination);
        newForm.append("description", this.state.vacation.description);
        newForm.append("imageFile", this.state.vacation.imageFile, this.state.vacation.imageFile.name);
        newForm.append("startDate", this.state.vacation.startDate.toString());
        newForm.append("endDate", this.state.vacation.endDate.toString());
        newForm.append("price", this.state.vacation.price.toString());
        const response = await axios.put<VacationModel>("http://localhost:3000/api/vacations/" + id, newForm, { headers: { 'authorization': 'Bearer ' + store.getState().token.toString() } });
        const vacation = response.data;
        alert("Vacation ID " + vacation.id + "Has Been Updated");
        store.getState().socket.emit("update-from-admin", 'vacation-updated');

    }

    public render(): JSX.Element {
        return (
            <div className="insert">
                <h2>Update Vacation</h2>
                <form>
                    <img className="previewImage"src={"http://localhost:3000/api/uploads/" + this.state.vacation.imageFileName} alt={""}/><br />
                    <input type="text" placeholder="Vacation Name..." onChange={this.setVacationName} value={this.state.vacation.vacationName} /> <br />
                    <input type="text" placeholder="Vacation Description..." onChange={this.setDescription} value={this.state.vacation.description} /> <br />
                    <input type="text" placeholder="Vacation Destination..." onChange={this.setDestination} value={this.state.vacation.destination} /> <br />
                    <input type="date" placeholder="Vacation End Date..." onChange={this.setStartDate} value={this.state.vacation.startDate} /> <br />
                    <input type="date" placeholder="Vacation Start Date..." onChange={this.setEndDate} value={this.state.vacation.endDate} /> <br />
                    New Image: <input type="file" accept="image/*" onChange={this.setPicFileName} ref={fi => this.fileInput = fi}/> <br />
                    <img src={this.state.imagePreview} className="uploadPreviewImage" alt={""}/><br />
                    <input type="number" placeholder="Vacation Price..." onChange={this.setPrice} value={this.state.vacation.price} /> <br />
                    <button type="button" onClick={this.updateVacation}>Update Vacation</button>
                </form>
            </div>
        );
    };
};

export default UpdateVacationAdmin;
