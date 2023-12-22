
import React, { useEffect, useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

export default function CreateListing() {
    const navigate = useNavigate();
    const params = useParams();
    const {currentUser} = useSelector(state => state.user);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '', 
        address: '', 
        type: 'rent',
        bedrooms: 1, 
        bathrooms: 1, 
        regularPrice: 0, 
        discountedPrice: 0,  
        offer: false, 
        parking: false, 
        furnished: false, 
    })
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {

        const fetchListing = async () => {

            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();

            if(data.success === false) {
                console.log(data.message);
            }
            setFormData(data)

        }

        fetchListing();

    }, [])
    
    const handleImageSubmit = (e) => {
        
        if(files.length >0 && files.length+formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)})
                setImageUploadError(false);
                setUploading(false);
                
            }).catch((err) => {
                setImageUploadError('Image uplaod failed');
                setUploading(false);
            });

            
        } else {
            setImageUploadError('You can only upload 6 images');
            setUploading(false);

        }
    }

    const storeImage = async (file) => {

        return new Promise((resolve, reject) => {

            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                })
            }
            )

        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        const { id, type, checked, value } = e.target;
      
        if (id === 'sale' || id === 'rent') {
          setFormData({
            ...formData,
            type: id
          });
        } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
          setFormData({
            ...formData,
            [id]: checked
          });
        } else if (type === 'number' || type === 'text' || type === 'textarea') {
          setFormData({
            ...formData,
            [id]: value
          });
        }
      };
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{

            if(formData.imageUrls.length < 1) return setImageUploadError('Please upload at least one image');
            if(+formData.regularPrice < +formData.discountedPrice) return setError('Discounted price cannot be greater than regular price'    );
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...formData,
                    userRef: currentUser._id,
                })
            });

            const data = await res.json();
            setLoading(false);

            if(data.success === false)
            {
                setError(data.message);
            }

            navigate(`/listing/${data._id}`);


        } catch(err) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Edit Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg ' id='name' maxLength='62' minLength='10' required/>
                    <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='border p-3 rounded-lg ' id='description' required/>
                    <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg ' id='address' required/>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2' items-center="true">
                            <input type="checkbox" className='w-5' onChange={handleChange} checked={formData.type === 'sale'} id='sale' />
                            <span>Sell</span>
                        </div> 
                        <div className='flex gap-2' items-center="true">
                            <input type="checkbox" className='w-5' onChange={handleChange} checked={formData.type === 'rent'} id='rent' />
                            <span>Rent</span>
                        </div> 
                        <div className='flex gap-2' items-center="true">
                            <input type="checkbox" className='w-5' onChange={handleChange} checked={formData.parking } id='parking' />
                            <span>Parking Spot</span>
                        </div> 
                        <div className='flex gap-2' items-center="true">
                            <input type="checkbox" className='w-5' onChange={handleChange} checked={formData.furnished } id='furnished' />
                            <span>Furnished</span>
                        </div> 
                        <div className='flex gap-2' items-center="true">
                            <input type="checkbox" className='w-5' onChange={handleChange} checked={formData.offer } id='offer' />
                            <span>Offer</span>
                        </div> 
                    </div>
                    <div className='flex flex-wrap gap-6 '>
                        <div className='flex items-center gap-2'>
                            <input onChange={handleChange} value={formData.bedrooms} type="number" className='border border-gray-300 p-3 rounded-lg ' id='bedrooms' min='1' max='10' required/>
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input onChange={handleChange} value={formData.bathrooms} type="number" className='border border-gray-300 p-3 rounded-lg ' id='bathrooms' min='1' max='10' required/>
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input onChange={handleChange} value={formData.regularPrice} type="number" className='border border-gray-300 p-3 rounded-lg ' id='regularPrice' required/>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className='text-xs'>(Rs/Month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                            <input onChange={handleChange} value={formData.discountedPrice} type="number" className='border border-gray-300 p-3 rounded-lg ' id='discountedPrice' required/>
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className='text-xs'>(Rs/Month)</span>
                            </div>
                        </div>
                        ) }
                        
                    </div>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                    <p className='font-semibold'>Images:
                        <span className='font normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} type="file" className='border border-gray-300 p-3 rounded w-full ' id='images' multiple accept='image/*'/>
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        
                    </div>
                    <p className='text-red-700 text-sm'> {imageUploadError && imageUploadError} </p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                            <div key={url} className="flex justify-between p-3 border">
                                <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }


                    <button disabled={loading || uploading} className="p-3 bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-white">
                        {loading ? 'Creating...' : 'Update Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'> {error} </p>}
                </div>

                
            </form>
        </main>
    );
}

