import { AppState } from "./appState";
import { ActionType } from "./actionType";
import { Action } from "./action";


export class Reducer {

    public static reduce(oldAppState: AppState, action: Action): AppState {

        const newAppState = { ...oldAppState };

        switch (action.type) {

            case ActionType.Login:
                newAppState.isLoggedIn = true;
                newAppState.user = action.payload.user.user;
                newAppState.token = newAppState.user.token;
                newAppState.isAdmin = newAppState.user.isAdmin;
                sessionStorage.setItem("user", JSON.stringify(newAppState.user));
                break;

            case ActionType.Logout:
                newAppState.isLoggedIn = false;
                newAppState.user = null;
                newAppState.token = null;
                newAppState.isAdmin = 0;
                newAppState.vacations = null;
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("vacations");
                break;

            case ActionType.GetVacations:
                newAppState.vacations = action.payload.vacations;
                console.log(newAppState.vacations);
                sessionStorage.setItem("vacations", JSON.stringify(newAppState.vacations));
                break;

            default: break;
        }

        return newAppState;
    }
}
