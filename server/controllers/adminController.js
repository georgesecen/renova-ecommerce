
exports.test = async (request, response) => {
    console.log("Working")

    return response.status(200).json({message: "Working"})
}