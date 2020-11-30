import React, { useState, useEffect } from 'react';
import 'loaders.css/loaders.css';
import MUIDataTable from "mui-datatables";
import { Button } from "reactstrap";
import $ from 'jquery';
import EditContactModal from "./EditContactModal"

const ContactsTable = () => {

  const [apiData, setApiData] = useState([])
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState({})


  // tar token fra localstorage og legger i globalt objekt
  const ajaxObj = {
    token: window.localStorage.myToken
  }

  useEffect(() => {
    getContacts()

  }, [])

  const getContacts = () => {
    $.ajax({
      url: `http://localhost:5000/getContacts`,
      type: "POST",
      data: ajaxObj,
      success: (data) => {
        let response = JSON.parse(data)
        let contacts = []

        response.map((element) => {
          contacts.push(element)
        })
        setApiData(contacts)
        setLoading(false)
      },
      error: () => {
        console.log("noe feilet?");
      }
    });
  }

  // sletter kontakt med hjelp av id
  const deleteContact = (tableMeta) => {
    // bruker kontakt id fra tablemeta og legger til ajaxObj
    ajaxObj.id = tableMeta

    $.ajax({
      url: `http://localhost:5000/deleteContact`,
      type: "POST",
      data: ajaxObj,
      success: () => {
        console.log("done")
        // refresher siden når en listing blir slettet
        window.location.reload()
      },
      error: () => {
        console.log("noe feilet?");
      }
    });
  }

  const options = {
    filterType: 'multiselect',
    pagination: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Ingen elementer i listen",
        toolTip: "Sorter",
      },

      toolbar: {
        search: "Søk",
        downloadCsv: "Last ned CSV",
        print: "Print",
        viewColumns: "Vis Kolonner",
        filterTable: "Filtrer Tabell",
      },
      filter: {
        all: "Alle",
        title: "FILTRERE",
        reset: "GJENNOPPRETT",
      },
      viewColumns: {
        title: "Vis Kolonner",
        titleAria: "Vis/Skjul Tabell Kolonner",
      },
      selectedRows: {
        text: "rad(er) valgt",
        delete: "Slett",
        deleteAria: "Slett Valgte Rader",
      },
    }
  };

  const apiColumns = [
    {
      label: "Id",
      name: "ID",
      options: {
        filter: true,
        sort: true,
        //display: "excluded",
      },
    },
    {
      label: "Info ID",
      name: "InfoID",
      options: {
        filter: true,
        sort: true,
        //"display": "excluded"
      },
    },
    {
      label: "Rediger",
      name: "",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <EditContactModal contactId={tableMeta.rowData[0]} />
        ),
      },
    },
    {
      label: "Slett",
      name: "",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <Button color="primary" onClick={deleteContact.bind(this, tableMeta.rowData[0])}>Slett</Button>
        ),
      },
    },
  ];

  if (loading) {
    return <h1>laster</h1>
  } else {
    return (
      <div className="card card-default" >
        {/*<CreateNewModal /> */}
        <MUIDataTable
          title="Tabell"
          data={apiData}
          columns={apiColumns}
          options={options}
        />
      </div>
    )
  }




}
export default ContactsTable

