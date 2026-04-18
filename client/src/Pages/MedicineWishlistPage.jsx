import { useDispatch, useSelector } from 'react-redux'
import { deleteMedicineWishlist, getMedicineWishlist } from '../Redux/ActionCreators/MedicineWishlistActionCreators'
import { useEffect } from 'react'
import WishlistPage from '../Components/Wishlist'

export default function MedicineWishlistPage() {
    const dispatch = useDispatch()
    const MedicineWishlistStateData = useSelector(state => state.MedicineWishlistStateData) || []

    useEffect(() => {
        const userId = localStorage.getItem("userid")
        if (userId) dispatch(getMedicineWishlist(userId))
    }, [dispatch])

    // ✅ Pass the correct delete action for medicine wishlist
    const handleDelete = (_id) => dispatch(deleteMedicineWishlist({ _id }))

    return (
        <WishlistPage
            data={MedicineWishlistStateData.map(item => ({ ...item, product: item.medicine }))}
            onDelete={handleDelete}
        />
    )
}