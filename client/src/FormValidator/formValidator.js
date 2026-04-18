

export default function formValidator(e) {
    let { name, value } = e.target
    switch (name) {
        case "name":
            if (!value || value.length === 0)
                return name + " Feild is Mendatory"
            else if (value.length < 3 || value.length > 70)
                return name + " Field Length Must Be 3-70 Characters"
            else
                return ""

        case "email":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 13 || value.length > 50)
                return name + " Field Length Must Be 13-50 Characters"
            else
                return ""

        case "phone":
        case "emergencyContact":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 10 || value.length > 10)
                return name + " Field Length Must Be Of 10 Characters"
            else if (!(value.startsWith("6") || value.startsWith("7") || value.startsWith("8") || value.startsWith("9")))
                return "Invalid Phone Number, It Must Start With 6,7,8 or 9"
            else
                return ""

        case "bio":
        case "description":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 15 || value.length > 70)
                return name + " Field Length Must Be 15-70 Characters"
            else
                return ""

        case "address":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 15)
                return name + " Field Length Must Be Greater than 15 Characters"
            else
                return ""

        case "state":
        case "city":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 5 || value.length > 70)
                return name + " Field Length Must Be 5-70 Characters"
            else
                return ""

        case "accreditation":
        case "qualification":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 2 || value.length > 50)
                return name + " Field Length Must Be 5-5 Characters"
            else
                return ""

        case "dob":
        case "experience":
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else
                return ""

        case "basePrice":
        case "fees":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value < 1)
                return "Base Price Must Be More Than 0"
            else
                return ""


        case "discount":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value < 0 || value > 100)
                return "Discount Must Be 0-100"
            else
                return ""

        case "stockQuantity":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value < 0)
                return "Stock Quantity Must Not Be Nagative"
            else
                return ""

    }
}
