import './Item.scss'
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import CropIcon from '@mui/icons-material/Crop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import APIapp from '../../../components/APIapp/APIapp';
import { getCookie } from '../../../utils/api';


function Item(props){
    const navigate = useNavigate() 
    const {userId, post} = props
    const [image, setImage] = useState('')
    const [address, setAddress] = useState('')
    const [rentFee, setRentFee] = useState('')
    const [elapsedTime, setElapsedTime] = useState('Vừa đăng');

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
    },[post])

    const handleUpdate=()=>{
        navigate(`/user/post/${post.id}/update`)
    }

    const handleDelete= async()=>{
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa?");

        if (userConfirmed) {
            try {
                const res = await APIapp.delete(`/posts/${post.id}`)
                console.log(res)
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
            }
        } else {
            console.log("Người dùng đã hủy xóa.");
        }
    }
    const handleNavigate=()=>{
        navigate(`/post/${post.id}`)
    }

    return(
        <div className='item'>
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
                <div className=''>
                    <button className='update' onClick={handleUpdate}>Chỉnh sửa</button>
                    <button className='delete' onClick={handleDelete}>Xóa bài</button>
                </div>
            </div>
        </div>
    )
}

export default Item