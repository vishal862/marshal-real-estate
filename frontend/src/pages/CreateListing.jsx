import React, { useState } from "react";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
// import {currentUser} from '../redux/user/userSlice'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'


export default function CreateListing() {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false
  });
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false)
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false)
      }).catch((err)=>{
        setImageUploadError('Image Upload Failed (Images Should be less than 3MB )');
        setUploading(false)
      })
    }else{
      setImageUploadError('You can upload only 6 Images per Listing');
      setUploading(false)

    }
  }

  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) =>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  //here what is happening is a "index" will come here from below when clicked delete button. But when delete button is clicked the filter method filters the imageUrl array by dropping the image index on which delete is clicked and creates a new array which will be given to handleRemoveImages , so now it will check from the new array which doesn't have that image so it will match "i" with "index" and of cource that new array won't have access to that image so imageaurl will store those images which doesn't match .
  const handleRemoveImage=(index)=>{
    setFormData({
      ...formData,
      imageUrls : formData.imageUrls.filter((_,i)=> i !== index)
    })
  }

  const handleChange = (e) => {
    if(e.target.id === 'sell' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type : e.target.id
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
    }

  }

  const handleSubmit= async (e)=>{
    e.preventDefault();

    try {

      if(formData.imageUrls.length < 1) return setError('Must upload at least 1 Image')

      if(+formData.regularPrice < +formData.discountPrice) return setError('Discounted Price must be less than Regular Price')
      setLoading(true);
      setError(false)

      const res = await fetch('/api/listing/create',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },

        // JSON.stringify() converts this combined object from web page to a JSON string that can be included in the body of an HTTP request. This string will be sent to the server as part of the POST request payload.

        body : JSON.stringify({
          ...formData,
          userRef : currentUser._id
        })

        //like this
        //   {
        //     "name": "anywheresdvs",
        //     "description": "anywhere",
        //     "address": "anywhere",
        //     "regularPrice": 50,
        //     "discountPrice": 50,
        //     "bathrooms": 1,
        //     "bedrooms": 1,
        //     "furnished": false,
        //     "parking": false,
        //     "type": "rent",
        //     "offer": false,
        //     "imageUrls": [
        //         "https://firebasestorage.googleapis.com/v0/b/marshal-estate.appspot.com/o/1711697582540signature_1635758852_995799%20(1).jpg?alt=media&token=01158edf-c40d-4748-a256-e69311c5909b",
        //         "https://firebasestorage.googleapis.com/v0/b/marshal-estate.appspot.com/o/1711697582543passport_picture_1635758852_478576.jpg?alt=media&token=9cdf6444-3c37-4793-8a80-da79d48a158a",
        //         "https://firebasestorage.googleapis.com/v0/b/marshal-estate.appspot.com/o/1711697582544passport_picture_1635758852_478576%20(1).jpg?alt=media&token=4d1fb589-a818-40d8-a5ae-3802064f9932",
        //         "https://firebasestorage.googleapis.com/v0/b/marshal-estate.appspot.com/o/1711697582545signature_1635758852_995799.jpg?alt=media&token=4869aba9-83d1-4f08-9dd2-2d5e6830d35c"
        //     ],
        //     "userRef": "66066833e442b62e3568fb9a",
        //     "_id": "66066ec06c4e1df69b6fd99a",
        //     "createdAt": "2024-03-29T07:33:20.115Z",
        //     "updatedAt": "2024-03-29T07:33:20.115Z",
        //     "__v": 0
        // }
      });
      //the JSON response received from the server is converted from a JSON string into a JavaScript object.
      const data = await res.json();

      //after console.log(data)
      //basically converts the o/p received from server to js object
      // {
      //   "success": true,
      //   "message": "Listing created successfully",
      //   "listingId": "123456789"
      // }
      
      setLoading(false);

      if(data.success === false){
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false);
      
    }
  }

  return (
    <main className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-slate-700"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-slate-700"
            id="description"
            required
          />
          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            placeholder="Address"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-slate-700"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input onChange={handleChange} checked={formData.type === 'sell'} type="checkbox" className="w-5" id="sell" />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input onChange={handleChange} checked={formData.parking} type="checkbox" className="w-5" id="parking" />
              <span>Parking Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input onChange={handleChange} checked={formData.furnished} type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input onChange={handleChange} checked={formData.offer} type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <input
                onChange={handleChange}
                value={formData.bedrooms}
                className="border p-3 rounded-lg border-gray-300"
                type="number"
                min="1"
                max="10"
                required
                id="bedrooms"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                className="border p-3 rounded-lg border-gray-300"
                type="number"
                min="1"
                max="10"
                required
                id="bathrooms"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                className="border p-3 rounded-lg border-gray-300"
                type="number"
                min="50"
                max="1000000"
                required
                id="regularPrice"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {
              formData.offer === true ? (
                <div className="flex items-center gap-3">
              <input
                onChange={handleChange}
                value={formData.discountPrice}
                className="border p-3 rounded-lg border-gray-300"
                type="number"
                min="0"
                max="1000000"
                required
                id="discountPrice"
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
              ) : ('')
            }
          </div>
          {/* Add other input fields similarly */}
        </div>
        <div className="flex flex-col gap-6">
          <p className="font-semibold text-gray-800">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              First Image will be Cover Image (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              className="border border-gray-300 rounded-lg p-3 w-full"
              accept="image/*"
              multiple
              id="images"
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="bg-green-700 text-white p-3 rounded-lg uppercase hover:shadow-lg focus:outline-none disabled:opacity-95"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
              <div key={url} className="flex justify-around p-3 border items-center">
                <img src={url} alt="Listing Images" className="w-40 h-40 object-contain rounded-lg"/>
                <button type="button" onClick={()=>handleRemoveImage(index)} className="bg-red-700 uppercase p-2 font-semibold text-white rounded-lg hover:opacity-75">Delete</button>
              </div>
            ))
          }
        </div>
        <button disabled={loading || uploading} className="bg-slate-700 text-white p-3 rounded-lg uppercase disabled:opacity-80 hover:opacity-95 focus:outline-none">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
        {error && <p className="text-red-700 font-semibold  text-sm">{error}</p>}
      </form>
    </main>
  );
}
