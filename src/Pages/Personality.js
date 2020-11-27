import React, { Component } from "react";
import Header from "../components/Header";

class Personality extends Component {
    render() {
        return (
            <div style={{ height: "95vh" }}>
                <Header {...this.props} />
                <iframe
                    title="personality"
                    src="https://personality1bot.herokuapp.com/"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                />
            </div>
        );
    }
}

export default Personality;
