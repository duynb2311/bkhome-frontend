import './findNearStop.scss'
import React, { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import APIapp from '../../components/APIapp/APIapp';
import PostItem from '../../components/postItem/PostItem';
import { getCookie } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function FindNearStop(){
    const [busNum, setBusnum] = useState([])
    const [formData, setFormData] =useState({
        busNum:'',
        distance: "1500"
    })
    const distance = [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    const [posts,setPosts] =useState([])
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [user, setUser] = useState({})
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1);
    const [isSearched, setIsSearched] = useState(false)

    useEffect(()=>{
        const fetchdata = async ()=>{
            const busNum = await APIapp.get(`/stops/allbusnum`)
            setBusnum(busNum.data)
        }
        fetchdata()
    },[])

    useEffect(()=>{
        const fetchData = async()=>{
            if (accessToken) {
                const userId = await APIapp.get(`/auth/profile`, {
                    params: {
                        Authorization: `${accessToken}`,
                    },
                })
                const userInfo = await APIapp.get(`/auth/user/info?id=${userId.data}`)
                setUser(userInfo.data)
            }
            if(isSearched){
                const Listpost = await APIapp.get(`/posts/nearstop?busNum=${formData.busNum}&maxDistance=${formData.distance}&page=${page-1}&size=10`)
                console.log(Listpost)
                setPosts(Listpost.data.content)
                setTotalPage(Listpost.data.totalPages)
            }
        }
        fetchData()
    },[page])

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = async ()=>{
        console.log(formData)
        const Listpost = await APIapp.get(`/posts/nearstop?busNum=${formData.busNum}&maxDistance=${formData.distance}&page=${page-1}&size=10`)
        console.log(Listpost)
        setPosts(Listpost.data.content)
        setTotalPage(Listpost.data.totalPages)
        setIsSearched(true)
    }


    return(
        <div className='find-near-stop'>
            <div className='search-bar'>
                <select name="busNum" id="" onChange={handleChange}>
                    <option value="">Tuyến Bus</option>
                    {busNum.map((busNum, index) => (
                        <option value={busNum}>{busNum}</option>
                    ))}
                </select>
                <select name="distance" id="" onChange={handleChange}>
                    <option value="">Chọn khoảng cách tối đa</option>
                    {distance.map((distance, index)=>(
                        <option value={distance}>{distance}</option>
                    ))}
                </select>
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
            <h2>Kết quả tìm kiếm</h2>
            <div className='list-item'>
                {posts.map((post)=>(
                    <PostItem userId = {user.id} post = {post}/>
                ))}
            </div>
            <Stack spacing={2}>
                {isSearched&&<Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" size='large' color='primary'/>}
            </Stack>
        </div>
    )
}

export default FindNearStop