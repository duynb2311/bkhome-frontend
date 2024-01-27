import { useEffect, useState } from 'react';
import './PostDetail.scss'
import { useParams, useNavigate } from 'react-router-dom';
import APIapp from '../../components/APIapp/APIapp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CropIcon from '@mui/icons-material/Crop';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getCookie } from '../../utils/api';
import MapContainer from '../../components/googleMaps/MapContainer';

function PostDetail(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [post, setPost]= useState({})
    const [images, setImages] = useState([])
    const [poster, setPoster] = useState({})
    const [imageSrc, setImageSrc] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-BiIorxpeD_vgAzBTgpx9vd6EQezMODouWZWDbv8wY55bX4z56X4RuBEdeVbrYaCyxkc&usqp=CAU")
    const [elapsedTime, setElapsedTime] = useState('Vừa đăng');
    const [rentFee, setRentFee] = useState('')
    const [rentDeposit, setRentDeposit] = useState('')
    const [electricCost, setElectricCost] = useState('')
    const [waterCost, setWaterCost] = useState('')
    const [serviceFee, setServiceFee] = useState('')
    const [structure, setStructure] = useState('')
    const [furniture, setFurniture] =useState('')
    const [feature, setFeature] = useState('')
    const [description, setDescript] =useState('')
    const [isSaved, setIsSaved] = useState(false)
    const [savedPost, setSavedPost] = useState({})
    const [user, setUser] = useState({})
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [toSaved, setToSaved] = useState({
        userId: 0,
        postId: 0
    })
    const [paragraphs, setParagraphs] = useState([])

    useEffect(()=>{
        const fetchData = async ()=>{
            const postRes = await APIapp.get(`/posts/${id}`)
            setPost(postRes.data)
            setImages(JSON.parse(postRes.data.imagePaths))
            setRentFee(postRes.data.rentFee)
            setRentDeposit(postRes.data.rentDeposit)
            setElectricCost(postRes.data.electricCost)
            setWaterCost(postRes.data.waterCost)
            setServiceFee(postRes.data.serviceFee)
            setStructure(postRes.data.structure)
            setFurniture(postRes.data.furniture)
            setFeature(postRes.data.otherFeature)
            setDescript(postRes.data.otherDescription)
            const poster = await APIapp.get(`/auth/user/info?id=${postRes.data.userId}`)
            setPoster(poster.data)

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
    },[])

    useEffect(()=>{
        const fetchData = async ()=>{
            if(user.id && post.id) 
            {
                setToSaved({...toSaved, userId:user.id, postId: post.id})
                const check = await APIapp.get(`/savedpost/check?userId=${user.id}&postId=${post.id}`)
                if(check.data.length!==0) {
                    setIsSaved(true)
                    setSavedPost(check.data[0])
                }
            }
        }
        fetchData()
    },[isSaved, post, user])

    
    useEffect(() => {
        const postedAt = new Date(post.createDate);
        const updateElapsedTime = () => {
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
        };
    
        updateElapsedTime()
      }, [post]);
    

    const convertFeature = (str)=> {
        const mapping = {
            'NX': 'chỗ để xe',
            'TM': 'thang máy',
            'BC': 'ban công',
            'ST': 'sân thượng',
            'GX': 'gác xép'
        };
    
        const arr = [];
        for (let i = 0; i < str.length; i += 3) {
            const key = str.substr(i + 1, 2);
            arr.push(str[i] === '1' ? mapping[key] : '');
        }
        return arr.filter(Boolean).join(', ');
    }

    const convertStructure =(str)=>{
        const mapping = {
            'N': 'phòng ngủ',
            'B': 'bếp',
            'K': 'phòng khách',
            'V': 'vệ sinh khép kín'
        };
    
        const arr = [];
        let i = 0;
        while (i < str.length) {
            const key = str.substr(i + 1, 1);
            if (str[i] === '1' || str[i] === '2' || str[i] === '3') {
                if (key === 'N') {
                    arr.push(str[i] + ' phòng ngủ');
                } else {
                    arr.push(mapping[key]);
                }
            }
            i += 2;
        }
        return arr.join(', ');
    }

    const convertFurniture= (str)=>{
        const mapping = {
            'DH': 'điều hòa',
            'TL': 'tủ lạnh',
            'NL': 'nóng lạnh',
            'MG': 'máy giặt',
            'BG': 'bếp ga',
            'BD': 'bếp điện'
        };
    
        const arr = [];
        for (let i = 0; i < str.length; i += 3) {
            const key = str.substr(i + 1, 2);
            arr.push(str[i] === '1' ? mapping[key] : '');
        }
        return arr.filter(Boolean).join(', ');
    }

    useEffect(()=>{
        console.log(description)
        if(description){
            setParagraphs(description.split('\\n'))
        }
    },[description])

    const handleSave = async () =>{
        if (accessToken) {
            const saved = await APIapp.post(`/savedpost`, toSaved)
            setIsSaved(true)
        }
        else{
            navigate(`/login`)
        }
    }
    
    const handleDelete =async () =>{
        const deleted = await APIapp.delete(`/savedpost/${savedPost.id}`)
        console.log(deleted)
        setIsSaved(false)
    }


    return(
        <div className='postdetail'>
            <div className='left'>
                <div id="myCarousel" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        {images.map((image, index) => (
                            <li
                                key={index}
                                data-target="#myCarousel"
                                data-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                            ></li>
                        ))}
                    </ol>
                    <div className="carousel-inner">
                        {images.map((image, index) => (
                            <div key={index} className={`item ${index === 0 ? 'active' : ''}`}>
                                <img src={image} alt={`Slide ${index}`} />
                            </div>
                        ))}
                    </div>
                    <a className="left carousel-control" href="#myCarousel" data-slide="prev" >
                        <span className="glyphicon glyphicon-chevron-left"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" href="#myCarousel" data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
                <h2>{post.title}</h2>
                <span><LocationOnIcon sx={{ color: '#1885E1' }}/>{post.address}</span>
                <div className='base-info'>
                    <span><LocalOfferIcon sx={{ color: '#B2B2B2' }}/>{rentFee.toLocaleString()} Đ/Tháng</span>
                    <span><CropIcon sx={{ color: '#B2B2B2' }}/>{post.area}m<sup>2</sup></span>
                    <span><AccessTimeIcon sx={{ color: '#B2B2B2' }}/>{elapsedTime}</span>
                </div>
                <h3>Thông tin mô tả</h3>
                <ul>
                    <li><strong>Tiền cọc:</strong> {rentDeposit.toLocaleString()} Đ/Tháng</li>
                    <li><strong>Giá điện:</strong> {electricCost.toLocaleString()} Đ/Số</li>
                    <li><strong>Giá nước:</strong> {waterCost.toLocaleString()} Đ/Tháng</li>
                    <li><strong>Các phí khác:</strong> {serviceFee.toLocaleString()} Đ/Tháng</li>
                    <li><strong>Cấu trúc phòng:</strong> {convertStructure(structure)}</li>
                    <li><strong>Nội thất:</strong> {convertFurniture(furniture)}</li>
                    <li><strong>Các tiện nghi khác:</strong> {convertFeature(feature)}</li>
                </ul>
                <h3>Các thông tin khác</h3>
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                <span className='notice'>Vui lòng đọc kỹ toàn bộ thông tin!</span>
                <h3>Bản đồ</h3>
                {description&&<MapContainer lat={post.latitude} lng={post.longitude}/>}
            </div>
            <div className='right'>
                <div className='poster'>
                    <img src={imageSrc} alt="" />
                    <p>Được đăng bởi</p>
                    <span>{poster.fullName}</span>
                    <span className='phone'><PhoneIcon fontSize="large"/>{poster.username}</span>
                    {!isSaved?<button onClick={handleSave}>Lưu tin</button>:<button onClick={handleDelete}>Bỏ lưu</button>}
                </div>
            </div>
        </div>
    )
}

export default PostDetail;