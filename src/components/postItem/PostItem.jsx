import { useEffect, useState } from 'react'
import './PostItem.scss'
import {useNavigate} from 'react-router-dom'
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CropIcon from '@mui/icons-material/Crop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import APIapp from '../APIapp/APIapp';
import { getCookie } from '../../utils/api';

function PostItem(props){
    const navigate = useNavigate() 
    const {userId, post} = props
    const [image, setImage] = useState('')
    const [address, setAddress] = useState('')
    const [rentFee, setRentFee] = useState('')
    const [elapsedTime, setElapsedTime] = useState('Vừa đăng');
    const [isSaved, setIsSaved] = useState(false)
    const [savedPost, setSavedPost] = useState({})
    const [isLogin, setIsLogin] = useState(false)
    const [toSaved, setToSaved] = useState({
        userId: 0,
        postId: 0
    })

    useEffect(()=>{
        if(post.imagePaths){
            const images = JSON.parse(post.imagePaths)
            setImage(images[0])
            const parts = post.address.split(',')
            const lastTwo=parts.slice(-2).join(',')
            setAddress(lastTwo)
            const postedAt = new Date(post.createDate);
            const now = new Date();
            const timeDifference = now.getTime() - postedAt.getTime();
            const minutes = Math.floor(timeDifference / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
        
            let newElapsedTime = '';
            if (days > 0) {
                newElapsedTime = `${days} ngày trước`;
            } else if (hours > 0) {
                newElapsedTime = `${hours} giờ trước`;
            } else if (minutes > 0) {
                newElapsedTime = `${minutes} phút trước`;
            } else {
                newElapsedTime = 'Vừa đăng';
            }
        
            setElapsedTime(newElapsedTime);
            setRentFee(post.rentFee)
        }
        const authentication = getCookie('Authorization');
        if(authentication!==""){
            setIsLogin(true)
        }
    },[post])

    useEffect(()=>{
        const fetchData = async ()=>{
            if(userId && post.id) 
            {
                setToSaved({...toSaved, userId:userId, postId: post.id})
                const check = await APIapp.get(`/savedpost/check?userId=${userId}&postId=${post.id}`)
                if(check.data.length!==0) {
                    setIsSaved(true)
                    setSavedPost(check.data[0])
                }
            }
        }
        fetchData()
    },[isSaved, post, userId])

    const handleSave = async () =>{
        if(isLogin){
            const saved = await APIapp.post(`/savedpost`, toSaved)
            setIsSaved(true)
        }else{
            navigate(`/login`)
        }
    }
    
    const handleDelete =async () =>{
        const deleted = await APIapp.delete(`/savedpost/${savedPost.id}`)
        console.log(deleted)
        setIsSaved(false)
    }

    const handleNavigate=()=>{
        navigate(`/post/${post.id}`)
    }

    return(
        <div className='post-item'>
            <div className='item-image'>
                <img src={image} alt="" onClick={handleNavigate}/>
            </div>
            <div className='info'>
                <p className='title' onClick={handleNavigate}>{post.title}</p>
                <div className='first-row'>
                    <span className='rent-fee'>{rentFee.toLocaleString()} Đ/Tháng</span>
                    <span><CropIcon sx={{ color: '#B2B2B2' }}/>{post.area}m<sup>2</sup></span>
                </div>
                <div className='second-row'>
                    <span className='address'>{address}</span>
                    <span ><AccessTimeIcon sx={{ color: '#B2B2B2' }}/>{elapsedTime}</span>
                </div>
                {!isSaved?<button onClick={handleSave}>Lưu tin</button>:<button onClick={handleDelete}>Bỏ lưu</button>}
            </div>
        </div>
    )
}

export default PostItem