import React from "react";
import { Container, Row } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingIndicator() {
    return (
        <Spinner animation="border" role="status">
            <Container fluid><Row><div>Loading...</div></Row></Container>
        </Spinner>
    );
}
