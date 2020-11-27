import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardText, Spinner, Button } from "reactstrap";
import Header from "./Header";

export default function EmpResources() {
    const [courses, setcourses] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        let data = localStorage.getItem("heaserData");
        data = JSON.parse(data);
        axios
            .get("/courses/get-courses", {
                page: 1,
                page_size: 10,
                category: data.tags[0],
            })
            .then(function (response) {
                setcourses(response.data.results);
                setloading(false);
            })
            .catch(function (error) {
                alert(error);
            });
    }, []);

    const displaycourses = courses.map((c) => {
        return (
            <Card>
                <CardBody>
                    <CardText>
                        <div className="row">
                            <div className="col-md-3">
                                <img alt="image_125_h" src={c.image_125_H} />
                            </div>
                            <div className="col-md-6">
                                <p style={{ fontWeight: "bold" }}>{c.title}</p>
                                <p>{c.headline}</p>
                            </div>
                            <div className="col-md-3">
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={"https://www.udemy.com" + c.url}
                                >
                                    <Button
                                        style={{
                                            float: "right",
                                            backgroundColor: "#1976d2",
                                        }}
                                    >
                                        View
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </CardText>
                </CardBody>
            </Card>
        );
    });
    const displaycheck =
        courses.length === 0 ? (
            <p>There are no recommendations for you :(</p>
        ) : (
            displaycourses
        );
    const display = loading === true ? <Spinner color="info" /> : displaycheck;

    return (
        <>
            <Header />
            <div className="container empresources">
                <br />
                <h2>Resources</h2>

                <h4>Recommendations for you :)</h4>
                <div className="row">
                    <div className="col-md-7">{display}</div>
                    <div className="col-md-5">
                        <Card style={{ padding: "5%" }}>
                            <CardBody>
                                <h4 style={{ fontWeight: "bold" }}>
                                    Download the resources uploaded by your
                                    organization here:
                                </h4>
                                <br />
                                <a
                                    href="trainingmaterial.pdf"
                                    target="_blank"
                                    download
                                >
                                    <Button
                                        style={{
                                            backgroundColor: "#1976d2",
                                            display: "block",
                                            margin: "auto",
                                            color: "white",
                                        }}
                                    >
                                        Download
                                    </Button>
                                </a>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
