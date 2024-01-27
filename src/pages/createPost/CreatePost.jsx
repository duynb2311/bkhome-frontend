import './CreatePost.scss'
import React, { useEffect, useState,useRef } from 'react';
import * as yup from 'yup';
import MapContainer from '../../components/googleMaps/MapContainer'
import Map from '../../components/googleMaps/Map';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from '../../firebase/app';
import APIapp from '../../components/APIapp/APIapp';
import { getCookie } from '../../utils/api';
import {useNavigate} from 'react-router-dom'

const validationSchema = yup.object().shape({
    title: yup.string().required('Số điện thoại không được bỏ trống'),
    imagePaths: yup.string().required('Mật khẩu không được bỏ trống'),
    type: yup.string().required('Mật khẩu không được bỏ trống'),
    latitude: yup.number().test('is-not-zero', 'Giá trị không được bằng 0', (value) => value !== 0),
    area: yup.string().test('is-not-zero', 'Giá trị không được bằng 0', (value) => value !== 0),
    rentFee: yup.number().test('is-not-zero', 'Giá trị không được bằng 0', (value) => value !== 0),
});

const validateProvince = yup.object().shape({
    name: yup.string().required('not allow null')
})
const validateDistrict = yup.object().shape({
    code: yup.string().required('not allow null')
})

function CreatePost (){
    const selectRef = useRef({});
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
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
        "otherDescription":""
    });

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
        }
        fetchData()
    },[])


    //address handle
    const [districts, setDistricts] = useState([])
    const [provinces, setProvinces] =useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState({name: "", code: ""});
    const [district, setDistrict] = useState({name: "", code: ""});
    const [ward, setWard] = useState('');
    const [street, setStreet] = useState('');
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
        if(ward!=='') {
            if(street!=='')setFormData({...formData, address: `${street}, ${ward}, ${district.name}, ${province.name}`})
            else setFormData({...formData, address: `${ward}, ${district.name}, ${province.name}`})
        }else{
            if(street!== '') setFormData({...formData, address: `${street}, ${district.name}, ${province.name}`})
            else setFormData({...formData, address: `${district.name}, ${province.name}`})
        }
    },[province, district, ward, street])

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
    const handleStreetChange = (event) => {
        setStreet(event.target.value);
    };



    //Map handle
    const getDataFromMap = (data) => {
        console.log('Data from Map:', data);
        setFormData({...formData, latitude: data.lat, longitude: data.lng})
    };


    //imagehandle
    const [images, setImages] = useState([]);
    const [firebaseUrl, setFirebaseUrl] = useState([])

    const handleImageChange = async (e) => {
        const fileList = e.target.files;
        const imageList = [];
        const urlList = [];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const firebaseUrl = await getFirebaseURLs(file)
            urlList.push(firebaseUrl)
            const reader = new FileReader();

            reader.onload = (event) => {
                imageList.push({ src: event.target.result, file }); // Lưu trữ đối tượng ảnh và tệp
                if (i === fileList.length - 1) {
                    setImages((prevImages) => [...prevImages, ...imageList]); // Thêm ảnh vào danh sách images
                    setFirebaseUrl((prev)=>[...prev, ...urlList])
                }
            };

            reader.readAsDataURL(file);
        }
    };
    const handleImageRemove = async (index) => {
        const newImages = [...images];
        newImages.splice(index, 1); // Xóa ảnh khỏi danh sách images
        setImages(newImages);
        const deleteURL = await deleteFileByUrl(firebaseUrl[index])
        const newUrls = [...firebaseUrl]
        newUrls.splice(index, 1)
        setFirebaseUrl(newUrls)
    };
    const generateRandomFileName = (file) => {
        const timestamp = new Date().getTime(); // Lấy thời gian hiện tại
        const randomString = Math.random().toString(36).substring(2, 8); // Sinh chuỗi ngẫu nhiên 6 ký tự
        
        // Lấy phần mở rộng của tệp tin
        const fileExtension = file.name.split('.').pop(); // Lấy phần sau dấu chấm cuối cùng trong tên file
      
        // Tạo tên file ngẫu nhiên kết hợp với phần mở rộng
        const randomFileName = `${timestamp}_${randomString}.${fileExtension}`;
      
        return randomFileName;
      };
    const deleteFileByUrl = async (fileUrl) => {
        // Trích xuất tên file từ URL
        const fileName = decodeURIComponent(fileUrl.split('/').pop().split('?')[0]); // Lấy phần sau dấu gạch chéo cuối cùng

        // Khởi tạo storage
        const storage = getStorage();

        // Tham chiếu đến file cần xóa
        const fileRef = ref(storage,fileName); // Thay đổi 'path/to/your-storage/' thành đường dẫn đến thư mục chứa file của bạn

        try {
            // Xóa file từ Firebase Storage
            await deleteObject(fileRef);
            console.log('File đã được xóa thành công');
        } catch (error) {
            console.error('Lỗi khi xóa file:', error);
        }
    };
    const getFirebaseURLs = async (file) => {
        const storageRef = getStorage(app)
        var downloadURL =""
            const fileRef = ref(storageRef, 'images/' + generateRandomFileName(file));

            try {
                const fileType = file.type;
                // Tải lên file lên Firebase Storage
                await uploadBytes(fileRef, file, { contentType: fileType });

                // Lấy URL cho file đã tải lên
                downloadURL = await getDownloadURL(fileRef);

                // Kiểm tra xem có thể sử dụng mảng firebaseURLs ở đây nếu bạn muốn
                console.log(downloadURL);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        

        return downloadURL
    };
    useEffect(()=>{
        const urlsJson = JSON.stringify(firebaseUrl)
        setFormData({...formData, imagePaths: urlsJson})
        if(firebaseUrl.length===0) setFormData({...formData, imagePaths: ""})
    },[firebaseUrl])



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

    const handleCreate = async () => {
        console.log(formData)
        try {
            await Promise.all([validateProvince.validate(province, {abortEarly: false}),validateDistrict.validate(district, {abortEarly: false}),validationSchema.validate(formData, { abortEarly: false })])
            const res = await APIapp.post('/posts', formData)
            console.log('Dữ liệu hợp lệ:', formData);
            navigate(`/post/${res.data.id}`)
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
        <div className='createpost'>
            <h1>Đăng tin mới</h1>
            <div className='address'>
                <h2>Địa chỉ cho thuê</h2>
                <div className='select-address'>
                    <div>
                        <label>Tỉnh/Thành phố</label>
                        <select name="province" id="province" onChange={handleProvinceChange} ref={(ref) => selectRef.current[1] = ref}>
                            <option value="" data-code="">Chọn Tỉnh/TP</option>
                            {provinces.map((province)=>(
                                <option key={province.code} value={province.name} data-code={province.code}>{province.name}</option>
                            ))}
                        </select>
                        {errors.name && <span className='errors'>{errors.name}</span>}
                    </div>
                    <div>
                        <label>Quận/Huyện</label>
                        <select name="district" id="district" onChange={handleDistrictChange} ref={(ref) => selectRef.current[2] = ref}>
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map((district)=>(
                                <option key={district.code} value={district.name} data-code={district.code}>{district.name}</option>
                            ))}
                        </select>
                        {errors.code && <span className='errors'>{errors.code}</span>}
                    </div>
                    <div>
                        <label>Phường/Xã</label>
                        <select name="ward" id="ward" onChange={handleWardChange}>
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((ward)=>(
                                <option key={ward.code} value={ward.name}>{ward.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='input'>
                    <label>Số nhà,Đường/Phố/Thôn</label>
                    <input type="text" name='homenumber' onChange={handleStreetChange}/>
                </div>
                <div className='full-address'>
                    <label>Địa chỉ cụ thể</label>
                    <span >{formData.address}</span>
                </div>
                <Map sendData={getDataFromMap} />
                {errors.latitude && <span className='errors'>{errors.latitude}</span>}
            </div>
            <div className='base-info'>
                <h2>Thông tin cơ bản</h2>
                <div className='infor'>
                    <label>Loại phòng</label>
                    <select name="type" id="type" onChange={(e)=>{setFormData({...formData, type:e.target.value})}}>
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
                    <input type="text" onChange={(e)=>{setFormData({...formData, title:e.target.value})}}/>
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
                        <input type="number" name='rentFee' step="500000" onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                    {errors.rentFee && <span className='errors'>{errors.rentFee}</span>}
                </div>
                <div className='input'>
                    <label>Giá cọc</label>
                    <div className='cost-input'>
                        <input type="number" name='rentDeposit' step="500000" onChange={handleChange}/>
                        <span>Đồng</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá điện</label>
                    <div className='cost-input'>
                        <input type="number" name='electricCost' step="1000" onChange={handleChange}/>
                        <span>Đồng/số</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá nước</label>
                    <div className='cost-input'>
                        <input type="number" name='waterCost' step="10000" onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá dịch vụ khác</label>
                    <div className='cost-input'>
                        <input type="number" name='serviceFee' step="50000" onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                </div>
            </div>
            <div className='structure'>
                <h2>Cấu trúc phòng</h2>
                <div className='input'>
                    <label>Diện tích</label>
                    <div className='area-input'>
                        <input type="number" name='area' onChange={handleChange}/>
                        <span>m<sup>2</sup></span>
                    </div>
                    {errors.area && <span className='errors'>{errors.area}</span>}
                </div>
                <div className='choose-structure'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bedroom1' onChange={handleStructureChange}/>
                        1 Phòng ngủ
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bedroom2' onChange={handleStructureChange}/>
                        2 phòng ngủ 
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bedroom3' onChange={handleStructureChange}/>
                        3 phòng ngủ
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='kitchen' onChange={handleStructureChange}/>
                        Có bếp
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='livingRoom' onChange={handleStructureChange}/>
                        Có phòng khách
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bathroom' onChange={handleStructureChange}/>
                        Vệ sinh khép kín
                    </label>
                </div>
            </div>
            <div className='furniture'>
                <h2>Nội thất</h2>
                <div className='choose-furniture'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='dieuhoa' onChange={handleFurnitureChange}/>
                        Điều hòa
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='tulanh' onChange={handleFurnitureChange}/>
                        Tủ lạnh
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='nonglanh' onChange={handleFurnitureChange}/>
                        Nóng lạnh
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='maygiat' onChange={handleFurnitureChange}/>
                        Máy giặt
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bepga' onChange={handleFurnitureChange}/>
                        Bếp ga
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bepdien' onChange={handleFurnitureChange}/>
                        Bếp điện
                    </label>
                </div>
            </div>
            <div className='other-feature'>
                <h2>Tiện nghi khác</h2>
                <div className='choose-feature'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='nhaxe' onChange={handleFeatureChange}/>
                        Chỗ để xe
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='thangmay' onChange={handleFeatureChange}/>
                        Thang máy
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bancong' onChange={handleFeatureChange}/>
                        Ban công
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='santhuong' onChange={handleFeatureChange}/>
                        Sân thượng
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='gacxep' onChange={handleFeatureChange}/>
                        Gác xép
                    </label>
                </div>
            </div>
            <div className='images'>
                <h2>Tải ảnh lên</h2>
                <input type="file" id="fileInput" accept="image/*" multiple onChange={handleImageChange} />
                <div className="image-gallery">
                    {images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={image.src} alt={`Uploaded Image ${index}`} className="uploaded-image" />
                            <button onClick={() => handleImageRemove(index)}>Xóa ảnh</button>
                        </div>
                    ))}
                </div>
                {errors.imagePaths && <span className='errors'>{errors.imagePaths}</span>}
            </div>
            <div className='video'>

            </div>      
            <div className='other-descript'>
                <h2>Thông tin mô tả khác</h2>
                <textarea name="otherDescription" id="" cols="100" rows="10" onChange={handleDescription}></textarea>
            </div>
            <div className='submit'>
                <button className='createbut' onClick={handleCreate}>Đăng tin</button>
            </div>
            
        </div>
    )
}

export default CreatePost;