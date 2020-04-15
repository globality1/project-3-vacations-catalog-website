import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import io from "socket.io-client";

export class AppState {
    public isLoggedIn: boolean;
    public user: UserModel;
    public isAdmin: number;
    public token: string;
    public vacations: VacationModel[];
    public socket: SocketIOClient.Socket;

    public constructor() {
        // get user info from sessionstorage named user
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.isLoggedIn = this.user !== null;
        this.socket = io.connect("http://localhost:3000");
        if (this.user) {
            // set isAdmin 
            this.isAdmin = this.user.isAdmin;
            // set token for jwt verifitcation
            this.token = this.user.token;
            // get user info from sessionstorage named user
            this.vacations = JSON.parse(sessionStorage.getItem("vacations"));
            // had an idea to try and see if I can push socket inside of the appstate, Apperenatly I can    
        } else {
            // clean all values
            this.isAdmin = 0;
            this.token = '';
            this.vacations = [];
        }
        
    }
}
