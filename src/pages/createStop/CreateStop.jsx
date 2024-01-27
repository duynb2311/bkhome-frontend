import { useState } from "react";
import MapContainer from "../../components/googleMaps/MapContainer";
import Map from "../../components/googleMaps/Map";
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function CreateStop(){
    const [busStop, setBusStop] = useState({
        "busNum": "26",
        "trainId": "",
        "latitude": 21.002743,
        "longitude": 105.859227,
        "type": "bus"
    })

    const busNum =["01", "01", "26", "31", "21A"]

    const getDataFromMap = (data) => {
        console.log('Data from Map:', data);
        setBusStop({...busStop, latitude: data.lat, longitude: data.lng})
    };

    const handleCreate = async()=>{
        console.log(busStop)
    }
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    return(
        <div>
            <Stack spacing={2}>
            <Typography>Page: {page}</Typography>
            <Pagination count={10} page={page} onChange={handleChange} />
            </Stack>
            <button onClick={handleCreate}>Create</button>
            <select name="" id="" onChange={(e)=>{setBusStop({...busStop, busNum: e.target.value})}}> 
                {busNum.map((num)=>(
                    <option value={num}>{num}</option>
                ))}
            </select>
            <Map sendData={getDataFromMap} />
        </div>
    )
}

export default CreateStop;