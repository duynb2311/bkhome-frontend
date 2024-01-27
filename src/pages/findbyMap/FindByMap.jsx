import './FindByMap.scss'
import React, { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import APIapp from '../../components/APIapp/APIapp';
import PostItem from '../../components/postItem/PostItem';
import { getCookie } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SearchMap from '../../components/googleMaps/SearchMap';

function FindByMap(){
    const [busNum, setBusnum] = useState([])
    const [formData, setFormData] =useState({
        latitude: 21.002046692523585,
        longitude: 105.85283758242755,
        distance: 10000
    })
    const distance = [200,500,1000,1500,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const getDataFromMap = (data) => {
        console.log('Data from Map:', data);
        setFormData({...formData, latitude: data.lat, longitude: data.lng})
    };

    const [posts,setPosts] =useState([])
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [user, setUser] = useState({})
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1);
    const [isSearched, setIsSearched] = useState(false)

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
                const Listpost = await APIapp.get(`/posts/searchbymap?latitude=${formData.latitude}&longitude=${formData.longitude}&distance=${formData.distance}&page=${page-1}&size=10`)
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
        const Listpost = await APIapp.get(`/posts/searchbymap?latitude=${formData.latitude}&longitude=${formData.longitude}&distance=${formData.distance}&page=${page-1}&size=10`)
        console.log(Listpost)
        setPosts(Listpost.data.content)
        setTotalPage(Listpost.data.totalPages)
        setIsSearched(true)
    }


    return(
        <div className='find-by-map'>
            <div className='search-bar'>
                <select name="distance" id="" onChange={handleChange}>
                    <option value="">Chọn khoảng cách tối đa</option>
                    {distance.map((distance, index)=>(
                        <option value={distance}>{distance} m</option>
                    ))}
                </select>
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
            <SearchMap sendData={getDataFromMap} radius={formData.distance}/>
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

export default FindByMap;