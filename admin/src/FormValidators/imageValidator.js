export default function imageValidator(e) {
  let files = e.target.files;

  // No file selected = optional in update form, skip validation
  if (!files || files.length === 0) return "";

  let file = files[0];

  if (file.size > 1048576)
    return "Pic Size is Too High. Please Upload an Image Upto 1MB";
  else if (
    !(
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/gif"
    )
  )
    return "Invalid Pic Format. Please Upload an Image of Type .png,.jpg,.jpeg,.gif";
  else 
    return "";
}