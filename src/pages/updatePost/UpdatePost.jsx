import './UpdatePost.scss'
import React, { useEffect, useState,useRef } from 'react';
import * as yup from 'yup';
import MapContainer from '../../components/googleMaps/MapContainer'
import Map from '../../components/googleMaps/Map';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from '../../firebase/app';
import APIapp from '../../components/APIapp/APIapp';
import { getCookie } from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

const validationSchema = yup.object().shape({
    title: yup.string().required('Số điện thoại không được bỏ trống'),
    imagePaths: yup.string().required('Mật khẩu không được bỏ trống'),
    type: yup.string().required('Mật khẩu không được bỏ trống'),
    latitude: yup.number().test('is-not-zero', 'Giá trị không được bằng 0', (value) => value !== 0),
    area: yup.string().test('is-not-zero', 'Giá trị không được bằng 0', (value) => value !== 0),
    rentFee: yup.number().test('is-not-zero', 'Giá trị không được bằng 0', (value) => value !== 0),
});

function UpdatePost (){
    const selectRef = useRef({});

    const {id} = useParams()

    const [formData, setFormData] = useState({
        "id":0,
        "userId": 0,
        "title": "",
        "address": "",
        "imagePaths": "",
        "type": "",
        "latitude": 0,
        "longitude": 0,
        "videoPath": "",
        "area": 0,
        "rentFee": 0,
        "rentDeposit": 0,
        "electricCost": 0,
        "waterCost": 0,
        "serviceFee": 0,
        "structure": "0N0B0K0VS",
        "furniture": "0DH0TL0NL0MG0BD0BG",
        "otherFeature": "0NX0TM0BC0ST0GX",
        "otherDescription":"",
        "createDate": ""
    });

    const [structureStr, setStructureStr] = useState('')
    const [featureStr, setFeatureStr] = useState('')
    const [furnitureStr, setFurnitureStr] = useState('')

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleDescription = (e)=>{
        const para = e.target.value.replace(/\n/g, '\\n')
        setFormData({...formData, otherDescription: para})
    }


    //user Handle
    const[user, setUser] = useState({})
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)

    useEffect(()=>{
        async function fetchData(){
            const userId= await APIapp.get(`/auth/profile`, {
                params: {
                    Authorization: `${accessToken}`,
                },
            })
            const userInfo = await APIapp.get(`/auth/user/info?id=${userId.data}`)
            setUser(userInfo.data)
            setFormData({...formData, userId: userInfo.data.id})
            const currentPost = await APIapp.get(`/posts/${id}`)
            setFormData(currentPost.data)
            setStructureStr(currentPost.data.structure)
            setFeatureStr(currentPost.data.otherFeature)
            setFurnitureStr(currentPost.data.furniture)
        }
        fetchData()
    },[])
    //structure handle
    const [structureoptions, setStructureOptions] = useState({
        bedroom1: false,
        bedroom2: false,
        bedroom3: false,
        kitchen: false,
        livingRoom: false,
        bathroom: false,
    });

    const handleStructureChange = (event) => {
        const { name, checked } = event.target;
        setStructureOptions({ ...structureoptions, [name]: checked });
    }
    useEffect(()=>{
        setFormData({...formData, structure: formatStructure(),});
    },[structureoptions])
    const formatStructure = () => {
        const bedroomValue = structureoptions.bedroom1 ? '1N' : '0N';
        const bedroomValue2 = structureoptions.bedroom2 ? '2N' : '0N';
        const bedroomValue3 = structureoptions.bedroom3 ? '3N' : '0N';
        const kitchenValue = structureoptions.kitchen ? '1B' : '0B';
        const livingRoomValue = structureoptions.livingRoom ? '1K' : '0K';
        const bathroomValue = structureoptions.bathroom ? '1VS' : '0VS';

        if (bedroomValue !== '0N' || bedroomValue2 !== '0N' || bedroomValue3 !== '0N') {
            if (bedroomValue3 === '3N') return bedroomValue3 + kitchenValue + livingRoomValue + bathroomValue;
            if (bedroomValue3 === '0N' && bedroomValue2 === '2N') return bedroomValue2 + kitchenValue + livingRoomValue + bathroomValue;
            if (bedroomValue3 === '0N' && bedroomValue3 === '0N') return bedroomValue + kitchenValue + livingRoomValue + bathroomValue;
        } else {
            return bedroomValue + kitchenValue + livingRoomValue + bathroomValue;
        }
    };

    useEffect(() => {
        const updatedOptions = {
          bedroom1: false,
          bedroom2: false,
          bedroom3: false,
          kitchen: false,
          livingRoom: false,
          bathroom: false,
        };
    
        if (formData.structure.startsWith('1N')) {
          updatedOptions.bedroom1 = true;
        } else if (formData.structure.startsWith('2N')) {
          updatedOptions.bedroom2 = true;
        } else if (formData.structure.startsWith('3N')) {
          updatedOptions.bedroom3 = true;
        }
    
        if (formData.structure.includes('1B')) {
          updatedOptions.kitchen = true;
        }
    
        if (formData.structure.includes('1K')) {
          updatedOptions.livingRoom = true;
        }
    
        if (formData.structure.includes('1VS')) {
          updatedOptions.bathroom = true;
        }
    
        setStructureOptions(updatedOptions);
    }, [structureStr]);

    
    

    //furniture handle
    const[furnitureOption, setFurnitureOption]= useState({
        dieuhoa: false,
        tulanh: false,
        nonglanh: false,
        maygiat: false,
        bepga: false,
        bepdien: false,
    })
    const handleFurnitureChange= (event)=>{
        const { name, checked } = event.target;
        setFurnitureOption({...furnitureOption, [name]:checked})
    }
    useEffect(()=>{
        setFormData({...formData, furniture: formatFurniture(),});
    },[furnitureOption])
    const formatFurniture= ()=>{
        const dieuhoaValue = furnitureOption.dieuhoa ? '1DH' : '0DH';
        const tulanhValue = furnitureOption.tulanh ? '1TL' : '0TL';
        const nonglanhValue = furnitureOption.nonglanh ? '1NL' : '0NL';
        const maygiatValue = furnitureOption.maygiat ? '1MG' : '0MG';
        const bepgaValue = furnitureOption.bepga ? '1BG' : '0BG';
        const bepdienValue = furnitureOption.bepdien ? '1BD' : '0BD';

        return dieuhoaValue + tulanhValue + nonglanhValue + maygiatValue + bepgaValue + bepdienValue
    }
    useEffect(() => {
        const updatedOptions = {
            dieuhoa: false,
            tulanh: false,
            nonglanh: false,
            maygiat: false,
            bepga: false,
            bepdien: false,
        };
    
        if (formData.furniture.includes('1DH')) {
          updatedOptions.dieuhoa = true;
        }
    
        if (formData.furniture.includes('1TL')) {
          updatedOptions.tulanh = true;
        }
    
        if (formData.furniture.includes('1NL')) {
          updatedOptions.nonglanh = true;
        }
        if (formData.furniture.includes('1MG')) {
          updatedOptions.maygiat = true;
        }
    
        if (formData.furniture.includes('1BG')) {
          updatedOptions.bepga = true;
        }
        if (formData.furniture.includes('1BD')) {
            updatedOptions.bepdien = true;
        }
    
        setFurnitureOption(updatedOptions);
    }, [featureStr]);


    //feature handle
    const [featureOption, setFeatureOption] = useState({
        nhaxe: false,
        thangmay: false,
        bancong: false,
        santhuong: false,
        gacxep: false,
    })
    const handleFeatureChange = (event)=>{
        const { name, checked } = event.target;
        setFeatureOption({...featureOption, [name]:checked})
    }
    useEffect(()=>{
        setFormData({...formData, otherFeature: formatFeature(),});
    },[featureOption])
    const formatFeature = ()=>{
        const nhaxeValue = featureOption.nhaxe ? '1NX' : '0NX';
        const thangmayValue = featureOption.thangmay ? '1TM' : '0TM';
        const bancongValue = featureOption.bancong ? '1BC' : '0BC';
        const santhuongValue = featureOption.santhuong ? '1ST' : '0ST';
        const gacxepValue = featureOption.gacxep ? '1GX' : '0GX';
        return nhaxeValue + thangmayValue + bancongValue + santhuongValue + gacxepValue
    }

    useEffect(() => {
        const updatedOptions = {
            nhaxe: false,
            thangmay: false,
            bancong: false,
            santhuong: false,
            gacxep: false,
        };
    
        if (formData.otherFeature.includes('1NX')) {
          updatedOptions.nhaxe = true;
        }
    
        if (formData.otherFeature.includes('1TM')) {
          updatedOptions.thangmay = true;
        }
    
        if (formData.otherFeature.includes('1BC')) {
          updatedOptions.bancong = true;
        }
        if (formData.otherFeature.includes('1ST')) {
          updatedOptions.santhuong = true;
        }
    
        if (formData.otherFeature.includes('1GX')) {
          updatedOptions.gacxep = true;
        }
    
        setFeatureOption(updatedOptions);
    }, [featureStr]);

    const handleCreate = async () => {
        console.log(formData)
        try {
            await Promise.all([validationSchema.validate(formData, { abortEarly: false })])
            const res = await APIapp.put(`/posts/${id}`, formData)
            console.log('Dữ liệu hợp lệ:', formData);
          } catch (validationErrors) {
            // Nếu có lỗi validate, cập nhật errors state với thông tin lỗi
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const newErrors = {};
            validationErrors.inner.forEach((error) => {
              newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
    };

    return(
        <div className='updatepost'>
            <h1>Chỉnh sửa tin đăng</h1>
            <div className='base-info'>
                <h2>Thông tin cơ bản</h2>
                <div className='infor'>
                    <label>Loại phòng</label>
                    <select name="type" id="type" value={formData.type} onChange={(e)=>{setFormData({...formData, type:e.target.value})}}>
                        <option value="">Chọn loại phòng</option>
                        <option value="t1">Phòng trọ chung chủ</option>
                        <option value="t2">Phòng trọ không chung chủ</option>
                        <option value="t3">Chung cư mini</option>
                        <option value="t4">HomeStay sinh viên</option>
                    </select>
                    {errors.type && <span className='errors'>{errors.type}</span>}
                </div>
                <div className='infor'>
                    <label>Tiêu đề</label>
                    <input type="text" value={formData.title} onChange={(e)=>{setFormData({...formData, title:e.target.value})}}/>
                    {errors.title && <span className='errors'>{errors.title}</span>}
                </div>
                <div className='infor'>
                    <label>Người cho thuê</label>
                    <span className='fullname'>{user.fullName}</span>
                </div>
                <div className='infor'>
                    <label>Số điện thoại</label>
                    <span className='phone'>{user.username}</span>
                </div>
                <div className='input'>
                    <label>Giá cho thuê</label>
                    <div className='cost-input'>
                        <input type="number" name='rentFee' step="500000" value={formData.rentFee} onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                    {errors.rentFee && <span className='errors'>{errors.rentFee}</span>}
                </div>
                <div className='input'>
                    <label>Giá cọc</label>
                    <div className='cost-input'>
                        <input type="number" name='rentDeposit' step="500000" value={formData.rentDeposit} onChange={handleChange}/>
                        <span>Đồng</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá điện</label>
                    <div className='cost-input'>
                        <input type="number" name='electricCost' step="1000" value={formData.electricCost} onChange={handleChange}/>
                        <span>Đồng/số</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá nước</label>
                    <div className='cost-input'>
                        <input type="number" name='waterCost' step="10000" value={formData.waterCost} onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá dịch vụ khác</label>
                    <div className='cost-input'>
                        <input type="number" name='serviceFee' step="50000" value={formData.serviceFee} onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                </div>
            </div>
            <div className='structure'>
                <h2>Cấu trúc phòng</h2>
                <div className='input'>
                    <label>Diện tích</label>
                    <div className='area-input'>
                        <input type="number" name='area' value={formData.area} onChange={handleChange}/>
                        <span>m<sup>2</sup></span>
                    </div>
                    {errors.area && <span className='errors'>{errors.area}</span>}
                </div>
                <div className='choose-structure'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bedroom1' checked={structureoptions.bedroom1} onChange={handleStructureChange}/>
                        1 Phòng ngủ
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bedroom2' checked={structureoptions.bedroom2} onChange={handleStructureChange}/>
                        2 phòng ngủ 
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bedroom3' checked={structureoptions.bedroom3} onChange={handleStructureChange}/>
                        3 phòng ngủ
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='kitchen' checked={structureoptions.kitchen} onChange={handleStructureChange}/>
                        Có bếp
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='livingRoom' checked={structureoptions.livingRoom} onChange={handleStructureChange}/>
                        Có phòng khách
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bathroom' checked={structureoptions.bathroom} onChange={handleStructureChange}/>
                        Vệ sinh khép kín
                    </label>
                </div>
            </div>
            <div className='furniture'>
                <h2>Nội thất</h2>
                <div className='choose-furniture'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='dieuhoa' checked={furnitureOption.dieuhoa} onChange={handleFurnitureChange}/>
                        Điều hòa
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='tulanh' checked={furnitureOption.tulanh} onChange={handleFurnitureChange}/>
                        Tủ lạnh
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='nonglanh' checked={furnitureOption.nonglanh} onChange={handleFurnitureChange}/>
                        Nóng lạnh
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='maygiat' checked={furnitureOption.maygiat} onChange={handleFurnitureChange}/>
                        Máy giặt
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bepga' checked={furnitureOption.bepga} onChange={handleFurnitureChange}/>
                        Bếp ga
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bepdien' checked={furnitureOption.bepdien} onChange={handleFurnitureChange}/>
                        Bếp điện
                    </label>
                </div>
            </div>
            <div className='other-feature'>
                <h2>Tiện nghi khác</h2>
                <div className='choose-feature'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='nhaxe' checked={featureOption.nhaxe} onChange={handleFeatureChange}/>
                        Chỗ để xe
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='thangmay' checked={featureOption.thangmay} onChange={handleFeatureChange}/>
                        Thang máy
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bancong' checked={featureOption.bancong} onChange={handleFeatureChange}/>
                        Ban công
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='santhuong' checked={featureOption.santhuong} onChange={handleFeatureChange}/>
                        Sân thượng
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='gacxep' checked={featureOption.gacxep} onChange={handleFeatureChange}/>
                        Gác xép
                    </label>
                </div>
            </div>     
            <div className='other-descript'>
                <h2>Thông tin mô tả khác</h2>
                <textarea name="otherDescription" id="" cols="100" rows="10" value={formData.otherDescription} onChange={handleDescription}></textarea>
            </div>
            <div className='submit'>
                <button className='createbut' onClick={handleCreate}>Cập nhật</button>
            </div>
            
        </div>
    )
}

export default UpdatePost;