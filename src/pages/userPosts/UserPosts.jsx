import './UserPost.scss'
import React, { useEffect, useState} from 'react';
import APIapp from '../../components/APIapp/APIapp';
import { getCookie } from '../../utils/api';
import Item from './userPostsItem/Item';

function UserPosts(){
    const [posts,setPosts] =useState([])
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [userId, setUserId] = useState()

    useEffect(()=>{
        const fetchData=async ()=>{
            const userId = await APIapp.get(`/auth/profile`, {
                params: {
                    Authorization: `${accessToken}`,
                },
            })
            setUserId(userId.data)
            const postRes = await APIapp.get(`/posts/user/${userId.data}`)
            setPosts(postRes.data)  
        }
        fetchData()
    },[])

    return(
        <div className='user-posts'>
            <h2></h2>
            <div className='list-post'>
                {posts.map((post)=>(
                    <Item userId = {userId} post = {post}/>
                ))}
            </div>
        </div>
    )
}

export default UserPosts