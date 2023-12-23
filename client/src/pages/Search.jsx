import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Search() {
    const navigate = useNavigate()
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order : 'desc',
})

const [loading, setLoading] = useState(false);
const [listings, setListings] = useState([]);
console.log(listings)

useEffect(() => {

    const urlPramas = new URLSearchParams(location.search);
    const searchTermFromUrl = urlPramas.get('searchTerm') ;
    const typeFromUrl = urlPramas.get('type') ;
    const parkingFromUrl = urlPramas.get('parking') ;
    const furnishedFromUrl = urlPramas.get('furnished') ;
    const offerFromUrl = urlPramas.get('offer') ;
    const sortFromUrl = urlPramas.get('sort') ;
    const orderFromUrl = urlPramas.get('order') ;

    if(
        searchTermFromUrl || 
        typeFromUrl || 
        parkingFromUrl || 
        furnishedFromUrl || 
        offerFromUrl || 
        sortFromUrl || 
        orderFromUrl
        ){
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order : orderFromUrl || 'desc',
        })
    }


    const fetchListings = async () => {
        setLoading(true)
        const searchQuery = urlPramas.toString()
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setLoading(false)
    }

    fetchListings()
    
}, [location.search])



const handleChange = (e) => {
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
        setSidebarData({...sidebarData, type: e.target.id})}

    if(e.target.id === 'searchTerm'){
        setSidebarData({...sidebarData, searchTerm: e.target.value})}

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ?  true : false})}

    if(e.target.id === 'sort_order'){

        const sort =  e.target.value.split('_')[0] || 'createdAt';
        const order = e.target.value.split('_')[1] || 'desc';

        setSidebarData({...sidebarData, sort, order})}
     };




const handleSubmit = (e) => {
    e.preventDefault();

    const urlPramas = new URLSearchParams()
    urlPramas.set('searchTerm', sidebarData.searchTerm)
    urlPramas.set('type', sidebarData.type)
    urlPramas.set('parking', sidebarData.parking)
    urlPramas.set('furnished', sidebarData.furnished)
    urlPramas.set('offer', sidebarData.offer)
    urlPramas.set('sort', sidebarData.sort)
    urlPramas.set('order', sidebarData.order)

    const searchQuery = urlPramas.toString()
    navigate(`/search?${searchQuery}`)

}




  return (
    <div className='flex flex-wrap md:flex-row'> 
      <div className="p-7 border-b-2 sm:border-r-2 sm:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className=" flex  items-center gap-2 ">
                <label htmlFor="" className="whitespace-nowrap font-semibold">Search Term</label>
                <input type="text" className="border rounded-lg p-3 w-full" id='searchTerm' placeholder='search' value={sidebarData.searchTerm} onChange={handleChange}/>

            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold' >Type:</label>
                <div className="flex gap-2">
                    <input type="checkbox" id='all' className='w-5' onChange={handleChange}  checked={sidebarData.type === 'all'}/>
                    <span>Rent & Sale</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='rent' className='w-5' onChange={handleChange}  checked={sidebarData.type === 'rent'} />
                    <span>Rent</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='sale' className='w-5' onChange={handleChange}  checked={sidebarData.type === 'sale'} />
                    <span>Sale</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='offer' className='w-5' onChange={handleChange}  checked={sidebarData.offer} />
                    <span>Offer</span>
                    
                </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Amenities:</label>
                <div className="flex gap-2">
                    <input type="checkbox" id='parking' className='w-5' onChange={handleChange}  checked={sidebarData.parking} />
                    <span>Parking</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='furnished' className='w-5' onChange={handleChange}  checked={sidebarData.furnished} />
                    <span>Furnished</span>
                    
                </div>
                
            </div>
            <div className="flex items-center gap-2">
                <label className='font-semibold'>Sort By:</label>
                <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='border rounded-lg p-3' >
                    <option value="regularPrice_desc">Price High to Low</option>
                    <option value="regularPrice_asc">Price Low to High</option>
                    <option value="createdAt_desc">Latest</option>
                    <option value="createdAt_asc">Oldest</option>
                </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div className="">
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results</h1>
      </div>
    </div>
  )
}
