export default function imageValidator(e) {
    let files = e.target.files
    if (files.length === 0)
        return "Pic Field is Mendatory"
    else if (files.length === 1) {
        let file = files[0]
        if (file.size > 1048576)
            return "Pic Size is Too High. Please Upload an Image Upto 1MB"
        else if (!(file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/gif"))
            return "Invalid Pic Format. Please Upload and Image of Type .png,.jpg,.jpeg,.gif"
        else
            return ""
    }
}
