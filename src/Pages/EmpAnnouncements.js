import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button,
    CardBody,
    CardText,
    Spinner,
    Table,
    Card,
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import moment from "moment";
import empannounce from "../assets/empannounce.svg";
import Header from "../components/Header";
import { useAuthContext } from "../Context/auth";

export default function EmpAnnouncements(props) {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [desc, setDesc] = useState("");
    const [heading, setHeading] = useState("");
    const toggle = () => setModal(!modal);
    const { userId, data } = useAuthContext();

    useEffect(() => {
        let heaserData = localStorage.getItem("heaserData");
        heaserData = JSON.parse(heaserData);
        axios
            .get(
                `/announcement/get-announcements-by-org/${heaserData.organization}`
            )
            .then(function (response) {
                setList(response.data.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const modaldisplay = async (event) => {
        const data = list.filter((obj) => {
            return obj._id === event.currentTarget.id;
        });
        console.log(data);
        await setHeading(data[0].heading);
        await setDesc(data[0].description);

        toggle();
    };
    const displaylist = list.map((l) => {
        return (
            <Card>
                <CardBody>
                    <CardText>
                        <p>
                            {moment(l.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                            )}
                        </p>

                        <div className="row">
                            <div className="col-md-6">{l.heading}</div>
                            <div className="col-md-6">
                                <Button
                                    id={l._id}
                                    style={{ backgroundColor: "#1976d2" }}
                                    onClick={modaldisplay}
                                >
                                    View
                                </Button>
                            </div>
                        </div>
                    </CardText>
                </CardBody>
            </Card>
        );
    });
    const displaycheck =
        list.length == 0 ? <p>There are no announcements</p> : displaylist;
    const display = loading == true ? <Spinner color="info" /> : displaycheck;
    return (
        <>
            <Header {...props} />
            <div className="container empannounce">
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Announcement</ModalHeader>
                    <ModalBody>
                        <h4>{heading}</h4>
                        <p>{desc}</p>
                    </ModalBody>
                </Modal>

                <h2>Announcements</h2>

                <div className="row">
                    <div className="col-md-6">{display}</div>
                    <div className="col-md-6">
                        <img src={empannounce} />
                    </div>
                </div>
            </div>
        </>
    );
}
