import './Result.scss'
import React, { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import APIapp from '../../components/APIapp/APIapp';
import PostItem from '../../components/postItem/PostItem';
import { getCookie } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


function Result(){

    const [posts,setPosts] =useState([])
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [user, setUser] = useState({})
    const [totalPage, setTotalPage] = useState(10)
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };
    
    const searchParams = new URLSearchParams(window.location.search);
    const formData = {
        "address": searchParams.get('address'),
        "bathroom": searchParams.get('src1'),
        "bedroom": searchParams.get('src2'),
        "busNum": searchParams.get('src3'),
        "distance": searchParams.get('src4'),
        "feature1": searchParams.get('src5'),
        "feature2": searchParams.get('src6'),
        "feature3": searchParams.get('src7'),
        "feature4": searchParams.get('src8'),
        "feature5": searchParams.get('src9'),
        "feature6": searchParams.get('src10'),
        "furniture1": searchParams.get('src11'),
        "furniture2": searchParams.get('src12'),
        "furniture4": searchParams.get('src13'),
        "furniture5": searchParams.get('src14'),
        "furniture6": searchParams.get('src15'),
        "kitchen": searchParams.get('src16'),
        "livingroom": searchParams.get('src17'),
        "maxArea": searchParams.get('src18'),
        "maxDeposit": searchParams.get('src19'),    
        "maxElectricCost": searchParams.get('src20'),
        "maxRentFee": searchParams.get('src21'),
        "maxWaterCost": searchParams.get('src22'),
        "minArea": searchParams.get('src23'),
        "minRentFee": searchParams.get('src24'),
        "nonglanh": searchParams.get('src25'),
        "trainId": searchParams.get('src26'),
        "type": searchParams.get('src27')
    }

    useEffect(()=>{
        const fetchData = async()=>{
            console.log(formData)
            const Listpost = await APIapp.post(`/posts/search?page=${page-1}&size=10`, formData)
            console.log(Listpost)
            setPosts(Listpost.data.content)
            setTotalPage(Listpost.data.totalPages)
            if (accessToken) {
                const userId = await APIapp.get(`/auth/profile`, {
                    params: {
                        Authorization: `${accessToken}`,
                    },
                })
                const userInfo = await APIapp.get(`/auth/user/info?id=${userId.data}`)
                setUser(userInfo.data)
            }
        }
        fetchData()
    },[page])
    
    return(
        <div className='search-result'>
            <h2>Kết quả tìm kiếm chi tiết</h2>
            <div className='list-item'>
                {posts.map((post)=>(
                    <PostItem userId = {user.id} post = {post}/>
                ))}
            </div>
            <Stack spacing={2}>
                <Pagination count={totalPage} page={page} onChange={handleChange} variant="outlined" size='large' color='primary'/>
            </Stack>
        </div>
    )
}
export default Result