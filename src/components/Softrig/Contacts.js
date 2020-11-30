import React, { useState, useEffect } from 'react';
import 'loaders.css/loaders.css';
import MUIDataTable from "mui-datatables";
import { Button } from "reactstrap";
import ContactsTable from "./ContactsTable"
import NewContactModal from "./NewContactModal"
import $ from 'jquery';


const Contacts = () => {

    useEffect(() => {
        CheckForCode()
        //console.log(window.localStorage)
    }, [])

    // funksjon som kjøres på knappetrykk for å sette i gang henting av authcode på backend
    const connectToApi = () => {
        window.location = "http://localhost:5000/getAuthCode"
    }

    // funksjon som sjekker for kode i url, om den finnes kjøres bytte av kode mot tokens på backend
    const CheckForCode = () => {

        // finner kode i url params
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let code = params.get('code');

        // om kode finnes kjører funksjonen
        if (code) {
            $.ajax({
                url: `http://localhost:5000/postToken?code=${code}`,
                type: "POST",
                success: (data) => {
                    // setter token i localstorage og fjerner "" rundt token
                    data = data.replace(/^"|"$/g, '')
                    window.localStorage.setItem("myToken", data)

                    // fjerner params og spesifikt "code" fra url, slik at funksjon ikke kjøres igjen.
                    window.history.pushState({}, document.title, "/" + "contacts");
                },
                error: function () {
                    console.log("noe feilet?");
                }
            });
        } else {
            return
        }
    }

    return (
        <div>
            <Button color="primary"
                style={{ marginBottom: "5px", marginLeft: "6px" }}
                onClick={connectToApi}>
                Koble til Softrig
                </Button>
            <NewContactModal />
            <ContactsTable />
        </div>

    )
}
export default Contacts