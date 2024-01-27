import './SavedPost.scss'
import React, { useEffect, useState} from 'react';
import APIapp from '../../components/APIapp/APIapp';
import PostItem from '../../components/postItem/PostItem';
import { getCookie } from '../../utils/api';

function SavedPost(){
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [savedPostId,setSavedPostId]= useState([])
    const [savedPosts,setSavedPosts]= useState([])
    const [userId, setUserId] = useState()

    useEffect(()=>{
        const fetchData = async ()=>{
            const userId = await APIapp.get(`/auth/profile`, {
                params: {
                    Authorization: `${accessToken}`,
                },
            })
            setUserId(userId.data)
            const savedPostId= await APIapp.get(`/savedpost/${userId.data}`)
            setSavedPostId(savedPostId.data)
        }
        fetchData()
    },[])

    useEffect(()=>{
        const fetchData =async ()=>{
            if(savedPostId.length>0){
                const arr=[]
                for(const id of savedPostId){
                    console.log(id)
                    const res = await APIapp.get(`/posts/${id.postId}`)
                    arr.push(res.data)
                }
                setSavedPosts([...savedPosts, ...arr])
            }
        }
        fetchData()
    },[savedPostId])

    console.log(savedPosts)

    return(
        <div>
            <h2>Tin đã lưu</h2>
            <div className='list-item'>
                {savedPosts.map((post)=>(
                    <PostItem userId = {userId} post = {post}/>
                ))}
            </div>
        </div>
    )
}

export default SavedPost