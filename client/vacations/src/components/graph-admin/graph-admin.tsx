import React, { Component } from "react";
import "./graph-admin.css";
import { store } from "../../redux/store";
import { VictoryChart, VictoryTheme, VictoryBar } from 'victory';
import { Redirect } from "react-router-dom";



export class GraphAdmin extends Component<any, any> {

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: []
        };
    }

    public componentDidMount(): void {
        this.checkIfLoggedIn();
        fetch("http://localhost:3000/api/follow/byVacation", { headers: new Headers({ 'authorization': 'Bearer ' + store.getState().token.toString() }) })
            .then(response => response.json())
            .then(vacations => this.setState({ vacations }))
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

    public render(): JSX.Element {
        return (
            <div className="graphs-admin">
                <VictoryChart
                    theme={VictoryTheme.grayscale}
                    domainPadding={40}
                    domain={{y: [0, 20] }}
                    
                >
                    <VictoryBar
                        barRatio={0.8}
                        style={{ data: { fill: "#c43a31" } }}
                        data={this.state.vacations}
                        labels={({ datum }) => `${datum.y} Followers`}
                    />
                </VictoryChart>
            </div>
        );
    }
};

export default GraphAdmin;
