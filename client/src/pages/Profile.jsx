import {useSelector} from 'react-redux'
import { useRef,useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart , 
  updateUserSuccess , 
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  SignOutUserStart,
  SignOutUserSuccess,
  SignOutUserFailure
} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';


export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser , loading , error} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
   
  const dispatch = useDispatch();

  useEffect(() => {
    if(file) {
      handleFileUpload(file); 
    }
  }, [file])

  const handleFileUpload =  (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
     (snpshot) => {
        const progress = (snpshot.bytesTransferred / snpshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      }
    ,
    (error) => {
      setFileUploadError(true);
    },

    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    }

    );


  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
       
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {

      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        
      });

      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch
    (error) {
      dispatch(deleteUserFailure(error.message))
    }

  }

  const handleSignOut = async () => {

    try {
      dispatch(SignOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignOutUserFailure(data.message));
        return;
      }
      dispatch(SignOutUserSuccess(data));
    } catch (error) {
      dispatch(SignOutUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false) {
        setShowListingsError(true);
        return;
      }

      setShowListingsError(false);
      setUserListings(data);

    } catch
    (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {

    try {

      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      
      });

      const data = await res.json();
      if(data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));


    } catch (error) {
       console.log(error);
    }

  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=> setFile(e.target.files[0])} type="file" id='avatar' className='border p-3 rounded-lg' ref={fileRef} hidden  accept='image/*'/>
        <img src={formData.avatar || currentUser.avatar} onClick={()=> fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
        {fileUploadError ? (
            <span className='text-red-700'>Error Image upload(image must be less than 2 mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image Successfully uploaded</span>
          ) : ""
          } 

        </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link to ={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
            Create Listing
        </Link>

      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      <p className='text-red-700 mt-5'>{error? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "Profile updated successfully" : ""}</p>
      <button className="text-green-700 w-full " onClick={handleShowListings}>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? "Error showing listings" : ""}</p>

      {userListings && userListings.length > 0 && 

        <div className="flex flex-col gap-4">
          <h1 className="text-center  text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
          <div  key={listing._id} className='border p-3 rounded-lg mt-5 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`} >
            <img className= 'h-16 w-16 object-contain ' src={listing.imageUrls[0]} alt="listing cover"  />
            </Link>
            <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-700 font-semibold hover:underline truncate' >
              <p className=''>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
                
              </div>

          </div>
        ))}
        </div>

      }
    </div>
  )
}