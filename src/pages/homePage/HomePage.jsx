import './HomePage.scss'
import React, { useEffect, useState,useRef } from 'react';
import Slider from '@mui/material/Slider';
import { useParams, useNavigate } from 'react-router-dom';
import APIapp from '../../components/APIapp/APIapp';
import PostItem from '../../components/postItem/PostItem';
import { getCookie } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { is } from 'date-fns/locale';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CropIcon from '@mui/icons-material/Crop';
import BackspaceIcon from '@mui/icons-material/Backspace';


function HomePage(){
    const selectRef = useRef({});
    const navigate = useNavigate()
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(100000000)
    const [price, setPrice] = useState([0, 10000000]);
    const [minArea, setMinArea] = useState(0)
    const [maxArea, setMaxArea] = useState(1000)
    const [area, setArea] = useState([0,100])
    const [address, setAddress] = useState('')
    const [hasArea, setHasArea] = useState(false)
    const [hasPrice, setHasprice] = useState(false)
    const [addressOpen, setAddressOpen] = useState(false)
    const [priceOpen, setPriceOpen] = useState(false)
    const [areaOpen, setAreaOpen] = useState(false)
    const [posts,setPosts] =useState([])
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)
    const [user, setUser] = useState({})
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1);
    const [isSearched,setIsSearched] = useState(false)

    const searchParams = new URLSearchParams(window.location.search);

    useEffect(()=>{
        const fetchData= async () =>{
            if (accessToken) {
                const userId = await APIapp.get(`/auth/profile`, {
                    params: {
                        Authorization: `${accessToken}`,
                    },
                })
                const userInfo = await APIapp.get(`/auth/user/info?id=${userId.data}`)
                setUser(userInfo.data)
            }
            if(searchParams.get('address')||searchParams.get('minPrice')||searchParams.get('maxPrice')||searchParams.get('minArea')||searchParams.get('maxArea')){
                const res = await APIapp.get(`/posts?address=${searchParams.get('address')}&minFee=${searchParams.get('minPrice')}&maxFee=${searchParams.get('maxPrice')}&minArea=${searchParams.get('minArea')}&maxArea=${searchParams.get('maxArea')}&page=${page-1}&size=10`)
                setTotalPage(res.data.totalPages)
                setPosts(res.data.content)
            }   
            else{
                const res = await APIapp.get(`/posts?page=${page-1}&size=10`)
                setTotalPage(res.data.totalPages)
                setPosts(res.data.content)
            }
        }
        fetchData()
    },[page, isSearched])

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePriceChange = (e, value) =>{
        setPrice(value)
        setMinPrice(value[0])
        if(value[1]<10000000)setMaxPrice(value[1])
        else setMaxPrice(100000000)
        setHasprice(true)
    }
    const handleAreaChange = (e, value)=>{
        setArea(value)
        setMinArea(value[0])
        if(value[1]<100)setMaxArea(value[1])
        else setMaxArea(1000)
        setHasArea(true)
    }

    const [districts, setDistricts] = useState([])
    const [provinces, setProvinces] =useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState({name: "", code: ""});
    const [district, setDistrict] = useState({name: "", code: ""});
    const [ward, setWard] = useState('');
    useEffect(()=>{
        const fetchdata = async ()=>{
            const provinceRes = await APIapp.get('/province')
            setProvinces(provinceRes.data)
        }
        fetchdata()
    },[])
    useEffect(()=>{
        const fetchdata = async ()=>{
            setDistrict({...district, name:"", code : ""});
            if(province.code!==""){
                const districtRes = await APIapp.get(`/district?provinceCode=${province.code}`)
                setDistricts(districtRes.data)
            }else{
                setDistricts([])
            }
        }
        fetchdata()
    },[province])
    useEffect(()=>{
        const fetchdata = async ()=>{
            if(district.code!==""){
                const wardRes = await APIapp.get(`/ward?districtCode=${district.code}`)
                setWards(wardRes.data)
            }else{
                setWards([])
                setWard('')
            }
        }
        fetchdata()
    },[district])
    useEffect(()=>{
        if(district.name!=='') {
            if(ward!=='')setAddress(`${ward}, ${district.name}, ${province.name}`)
            else setAddress(`${district.name}, ${province.name}`)
        }else{
            setAddress(`${province.name}`)
        }
    },[province, district, ward])

    const handleProvinceChange = (event) => {
        const selectElement = selectRef.current[1];
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const code = selectedOption.getAttribute('data-code');
        setProvince({...province, name:event.target.value, code : code});
    };
    const handleDistrictChange = (event) => {
        const selectElement = selectRef.current[2];
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const code = selectedOption.getAttribute('data-code');
        setDistrict({...district, name:event.target.value, code : code});
    };
    const handleWardChange = (event) => {
        setWard(event.target.value);
    };

    const toggleAddress = ()=>{
        setAddressOpen(!addressOpen)
        setPriceOpen(false)
        setAreaOpen(false)
    }
    const togglePrice = ()=>{
        setPriceOpen(!priceOpen)
        setAddressOpen(false)
        setAreaOpen(false)
    }
    const toggleArea = ()=>{
        setAreaOpen(!areaOpen)
        setAddressOpen(false)
        setPriceOpen(false)
    }

    const handleDeleteAddress = (event)=>{
        event.stopPropagation();
        setAddress('')
        setAddressOpen(false)
    } 

    const handleDeletePrice = (event)=>{
        event.stopPropagation();
        setMinPrice(0)
        setMaxPrice(100000000)
        setPrice([0,10000000])
        setHasprice(false)
        setPriceOpen(false)
    }
    const handleDeleteArea=(event)=>{
        event.stopPropagation();
        setMinArea(0)
        setMaxArea(1000)
        setArea([0,100])
        setHasArea(false)
        setAreaOpen(false)
    }


    const handleSearch=()=>{
        setAreaOpen(false)
        setAddressOpen(false)
        setPriceOpen(false)
        if(!address&&minPrice===0&&maxPrice===100000000&&minArea===0&&maxArea===1000) navigate('/')
        else navigate(`?address=${encodeURIComponent(address)}&minPrice=${minPrice}&maxPrice=${maxPrice}&minArea=${minArea}&maxArea=${maxArea}`)
        setIsSearched(!isSearched)
    }

    return(
        <div className='homepage'>
            <div className='search-bar'>
                <div className='address' onClick={toggleAddress}>
                    <LocationOnIcon sx={{ color: '#1885E1' }}/>
                    {!address?<span>Toàn quốc</span>:<span className='bold-span'>{address}</span>}
                    {address&&<BackspaceIcon className='delete-icon' onClick={handleDeleteAddress}/>}
                </div>
                {addressOpen && <div className='address-choose'>
                    <div>
                        <label>Tỉnh/Thành phố</label>
                        <select name="province" id="province" onChange={handleProvinceChange} ref={(ref) => selectRef.current[1] = ref}>
                            <option value="" data-code="">Chọn Tỉnh/TP</option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.name} data-code={province.code}>{province.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Quận/Huyện</label>
                        <select name="district" id="district" onChange={handleDistrictChange} ref={(ref) => selectRef.current[2] = ref}>
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map((district) => (
                                <option key={district.code} value={district.name} data-code={district.code}>{district.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Phường/Xã</label>
                        <select name="ward" id="ward" onChange={handleWardChange}>
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((ward) => (
                                <option key={ward.code} value={ward.name}>{ward.name}</option>
                            ))}
                        </select>
                    </div>
                </div>}
                <div className='price' onClick={togglePrice}>
                    <LocalOfferIcon sx={{ color: '#B2B2B2' }}/>
                    {!hasPrice?<span>Chọn khoảng giá</span>:<span className='bold-span'>{minPrice} - {(maxPrice<10000000?maxPrice:'10000000+')}</span>}
                    {hasPrice&&<BackspaceIcon className='delete-icon' onClick={handleDeletePrice}/>}
                </div>
                {priceOpen && <div className='price-choose'>
                    <h3>Chọn khoảng giá</h3>
                    <span>{minPrice} - {(maxPrice<10000000?maxPrice:'Trên 10000000')} Đồng/tháng</span>
                    <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={price}
                        min={0}
                        step={500000}
                        max={10000000}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                    />
                </div>}
                <div className='area' onClick={toggleArea}>
                    <CropIcon sx={{ color: '#B2B2B2' }}/>
                    {!hasArea?<span>Chọn diện tích</span>:<span className='bold-span'>{minArea} - {(maxArea<100)?maxArea:'Trên 100'}</span>}
                    {hasArea&&<BackspaceIcon className='delete-icon' onClick={handleDeleteArea}/>}
                </div>
                {areaOpen && <div className='area-choose'>
                    <h3>Chọn khoảng diện tích</h3>
                    <span>{minArea} - {(maxArea<100)?maxArea:'Trên 100'}m<sup>2</sup></span>
                    <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={area}
                        min={0}
                        step={5}
                        max={100}
                        onChange={handleAreaChange}
                        valueLabelDisplay="auto"
                    />
                </div>}
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
            <div className='list-item'>
                <h2>Danh sách phòng trọ</h2>
                {posts.map((post)=>(
                    <PostItem userId = {user.id} post = {post}/>
                ))}
            </div>
            <Stack spacing={2}>
                <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" size='large' color='primary'/>
            </Stack>
        </div>
    )
}

export default HomePage;